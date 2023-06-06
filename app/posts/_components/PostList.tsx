import Link from "next/link";
import { Post, PostCount, Subject } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import styles from "./PostList.module.css";
import SubjectNav from "./SubjectNav";
import { timeSince } from "@/lib/datetime";

type Props = {
  categoryID?: string;
  subjectID?: string;
  offset?: number;
  limit?: number;
};

export default async function PostList({
  categoryID,
  subjectID,
  offset = 0,
  limit = 20,
}: Props) {
  let posts: CommonPost[] = [];

  if (subjectID) {
    posts = await prisma.post.findMany({
      where: { subjectID: parseInt(subjectID, 10) },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: Math.min(limit, 20),
      include: { subject: true },
    });
  } else {
    if (categoryID) {
      posts = await prisma.post.findMany({
        where: { subject: { categoryID: parseInt(categoryID, 10) } },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: Math.min(limit, 20),
        include: { subject: true },
      });
    } else {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: Math.min(limit, 20),
        include: { subject: true },
      });
    }
  }

  if (posts.length === 0) {
    return (
      <div className={styles.postList}>
        <ListHeader categoryID={categoryID} />
        <ListEmpty />
      </div>
    );
  }

  return (
    <div className={styles.postList}>
      <ListHeader categoryID={categoryID} />
      {posts.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
}

async function ListHeader({ categoryID }: { categoryID?: string }) {
  if (!categoryID) {
    return <div className={styles.listHeader}></div>;
  }

  const subjects = await prisma.subject.findMany({
    where: { categoryID: parseInt(categoryID, 10) },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.listHeader}>
      <SubjectNav serverSubjects={subjects} />
      <div className={styles.shapeDescription}>
        <div>♥ 좋아요 수</div>
        <div>◆ 읽은 수</div>
      </div>
    </div>
  );
}

function ListEmpty() {
  return <div className={styles.listEmpty}>첫번째 글을 작성해주세요!</div>;
}

function PostItem(post: CommonPost) {
  return (
    <div className={styles.postItem}>
      <div className={styles.left}>
        <div className={styles.subjectName}>{post.subject.name}</div>
        <div>
          <div className={styles.title}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
            <div className={styles.date}>
              {post.updatedAt
                ? timeSince(post.updatedAt)
                : timeSince(post.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.rightItem}>
          <div>♥</div>
          <div>{post.counts?.likeCount}</div>
        </div>
        <div className={styles.rightItem}>
          <div>◆</div>
          <div>{post.counts?.viewCount}</div>
        </div>
      </div>
    </div>
  );
}

type CommonPost = Post & { subject: Subject; counts?: PostCount | null };