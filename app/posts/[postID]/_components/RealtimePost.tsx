"use client";

import { useEffect, useState } from "react";

import { Database } from "@/lib/database.types";
import { Category, Post, PostCount, Subject } from "@prisma/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import styles from "./RealtimePost.module.css";
import { timeSince } from "@/lib/datetime";
import { useRouter } from "next/navigation";
import AnimateHeart from "@/app/_components/AnimateHeart";

type Props = {
  serverPost: Post & {
    subject: Subject & {
      category: Category;
    };
    counts: PostCount | null;
  };
};

function RealtimePost({ serverPost }: Props) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [post, setPost] = useState(serverPost);
  const [clickHeart, setClickHeart] = useState(false);

  useEffect(() => {
    setPost(serverPost);
  }, [serverPost]);

  const onHeartClick = () => {
    setClickHeart((p) => !p);
  };

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime post")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "UPDATE",
  //         schema: "public",
  //         table: "posts",
  //         filter: `id=${post.id}`,
  //       },
  //       (payload) => {
  //         setPost(payload.new as Post);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase, post, setPost]);

  return (
    <div className={styles.box}>
      <button className={styles.category} onClick={() => router.back()}>
        <div className={styles.backButton}>{"<"}</div>
        {post.subject.category.name}
      </button>

      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.title}>{post.title}</div>
        </div>
        <div className={styles.header}>
          <div style={{ display: "flex", gap: 4 }}>
            <div className={styles.writer}>제트</div>·
            <div className={styles.date}>{timeSince(post.createdAt)}</div>
          </div>
          <div className={styles.count}>
            좋아요{" "}
            <span style={{ color: "black", marginRight: 10 }}>
              {post.counts?.likeCount ?? 0}
            </span>
            조회수{" "}
            <span style={{ color: "black" }}>
              {post.counts?.viewCount ?? 0}
            </span>
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.tags}>
          {/* {post.tags.map((tag) => (
          <div className={styles.tag}>{tag}</div>
        ))} */}
        </div>

        <div className={styles.body}>
          <div className={styles.content}>{post.content}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.heartButton} onClick={onHeartClick}>
          {clickHeart ? "♥" : "♡"}
          {clickHeart && <AnimateHeart key={post.id} id={post.id} />}
        </button>
      </div>
    </div>
  );
}

export default RealtimePost;
