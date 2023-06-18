"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Post, PostCount, Subject } from "@prisma/client";

import DevpanSVG from "@/asset/devpan.svg";
import AnimateHeart from "@/app/_components/AnimateHeart";
import { Database } from "@/lib/database.types";
import { timeSince } from "@/lib/datetime";

import styles from "./RealtimePost.module.css";

type Props = {
  serverPost: Post & {
    subject: Subject & {
      category: Category;
    };
    counts: PostCount | null;
  };
  incrementOrDecrementLikeCount: () => Promise<void>;
  postLike?: boolean;
};

function RealtimePost({
  serverPost,
  incrementOrDecrementLikeCount,
  postLike,
}: Props) {
  const isMounted = useRef(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [post, setPost] = useState(serverPost);
  const [clickHeart, setClickHeart] = useState(postLike);

  useEffect(() => {
    setPost(serverPost);
    isMounted.current = true;
  }, [serverPost]);

  const onHeartClick = () => {
    setClickHeart((p) => !p);
    incrementOrDecrementLikeCount();
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
      <button
        className={styles.category}
        onClick={() => {
          router.back();
          router.refresh();
        }}
      >
        <div className={styles.backButton}>{"<"}</div>
        {post.subject.category.name}
      </button>

      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.title}>{post.title}</div>
        </div>
        <div className={styles.header}>
          <div className={styles.info}>
            <Image
              alt="avatar"
              src={post?.avatar || DevpanSVG}
              width={20}
              height={20}
            />
            <div className={styles.writer}>{post.writer}</div>·
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
          {isMounted.current && clickHeart && (
            <AnimateHeart key={post.id} id={post.id} />
          )}
        </button>
      </div>
    </div>
  );
}

export default RealtimePost;
