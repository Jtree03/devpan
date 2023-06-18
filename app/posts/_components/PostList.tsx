import Link from "next/link";
import Image from "next/image";
import { Post, PostCount, Subject } from "@prisma/client";

import DevpanSVG from "@/asset/devpan.svg";
import { prisma } from "@/lib/prisma";
import { timeSince } from "@/lib/datetime";

import SubjectNav from "./SubjectNav";
import styles from "./PostList.module.css";

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
      include: { subject: true, counts: true },
    });
  } else {
    if (categoryID) {
      posts = await prisma.post.findMany({
        where: { subject: { categoryID: parseInt(categoryID, 10) } },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: Math.min(limit, 20),
        include: { subject: true, counts: true },
      });
    } else {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: Math.min(limit, 20),
        include: { subject: true, counts: true },
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
        <div>♥ 좋아요</div>
        <div>◆ 조회수</div>
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
            <div className={styles.info}>
              <div className={styles.writer}>
                <Image
                  alt="profile"
                  src={post.avatar || DevpanSVG}
                  width={20}
                  height={20}
                />
                {post.writer || "anonymous"}
              </div>
              ·
              <div className={styles.date}>
                {post.updatedAt
                  ? timeSince(post.updatedAt)
                  : timeSince(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.rightItem}>
          <div>♥</div>
          <div>{post.counts?.likeCount ?? 0}</div>
        </div>
        <div className={styles.rightItem}>
          <div>◆</div>
          <div>{post.counts?.viewCount ?? 0}</div>
        </div>
      </div>
    </div>
  );
}

type CommonPost = Post & { subject: Subject; counts?: PostCount | null };
