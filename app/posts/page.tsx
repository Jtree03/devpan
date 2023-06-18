import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import Loading from "../_components/Loading";
import PostList from "./_components/PostList";
import CategoryNav from "./_components/CategoryNav";

import styles from "./posts.module.css";

type Props = {
  searchParams: {
    categoryID?: string;
    subjectID?: string;
    offset?: number;
    limit?: number;
  };
};

export default async function PostsPage({ searchParams }: Props) {
  const { categoryID, subjectID, offset, limit } = searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  const category =
    categories.find((category) => category.id.toString() === categoryID) ??
    (await prisma.category.findFirst({ where: { name: "개발판" } }));
  if (!category) {
    notFound();
  }

  const subject = subjectID
    ? await prisma.subject.findFirst({
        where: { id: parseInt(subjectID, 10) },
      })
    : undefined;

  const editLink = new URLSearchParams();
  if (categoryID) editLink.set("categoryID", categoryID);
  if (subjectID) editLink.set("subjectID", subjectID);

  return (
    <div className={styles.page}>
      <div className={styles.split}>
        <section className={styles.left}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{category.name}</h2>
            {subject && subject?.name !== "공지" && (
              <Link href={`/posts/edit?${editLink.toString()}`}>
                <button className={styles.writeButton}>글쓰기</button>
              </Link>
            )}
          </div>
          <Suspense fallback={<Loading />}>
            <PostList
              categoryID={category.id.toString()}
              subjectID={subjectID}
              offset={offset}
              limit={limit}
            />
          </Suspense>
        </section>
        <section className={styles.right}>
          <CategoryNav serverCategories={categories} />
        </section>
      </div>
    </div>
  );
}
