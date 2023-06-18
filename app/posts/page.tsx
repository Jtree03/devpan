import { Suspense } from "react";
import { notFound } from "next/navigation";

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

  return (
    <div className={styles.page}>
      <div className={styles.split}>
        <section className={styles.left}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{category.name}</h2>
            <button className={styles.writeButton}>글쓰기</button>
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
