"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TechStack, TechStackCount } from "@prisma/client";

import { Database } from "@/lib/database.types";

import AnimateHeart from "../../_components/AnimateHeart";

import styles from "./TechStackCard.module.css";

type CombinedTechStack = TechStack & { counts?: TechStackCount | null };

type Props = {
  techStack: CombinedTechStack;
  increment: (id: number) => Promise<void>;
};

function TechStackCard(props: Props) {
  const { techStack, increment } = props;

  return (
    <li className={styles.techStackCard}>
      <ImageSection techStack={techStack} />
      <InfoSection serverTechStack={techStack} increment={increment} />
      <DescriptionSection techStack={techStack} />
    </li>
  );
}

export default TechStackCard;

function ImageSection({ techStack }: { techStack: CombinedTechStack }) {
  return (
    <Link
      href={
        techStack.categoryID
          ? {
              pathname: "/posts",
              query: { categoryID: techStack.categoryID },
            }
          : "/posts"
      }
    >
      <div className={styles.techStackImageWrapper}>
        {techStack.image ? (
          <Image
            alt="tech_image"
            src={techStack.image}
            fill
            className={styles.techStackImage}
          />
        ) : (
          <div className={styles.techStackSubstitution}>{techStack.name}</div>
        )}
      </div>
    </Link>
  );
}

function InfoSection({
  serverTechStack,
  increment,
}: {
  serverTechStack: CombinedTechStack;
  increment: (id: number) => Promise<void>;
}) {
  const [techStack, setTechStack] = useState(serverTechStack);
  const { id, name, counts, createdAt, updatedAt } = techStack;
  const supabase = createClientComponentClient<Database>();

  const autoIncrement = useRef(0);
  const [clickAnimationArr, setClickAnimationArr] = useState<number[]>([]);
  const [likeClickCount, setLikeClickCount] = useState(0);

  const onClickHeart = async () => {
    setLikeClickCount((prev) => prev + 1);
    setClickAnimationArr((prev) => [...prev, autoIncrement.current++]);
    await increment(id);
  };

  useEffect(() => {
    const channel = supabase
      .channel(`techstack:${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "TechStack",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log(payload);
          setLikeClickCount((prev) => prev + 1);
          setClickAnimationArr((prev) => [...prev, autoIncrement.current++]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  return (
    <div className={styles.techStackTitleWrapper}>
      <div>
        <h3 className={styles.techStackTitle}>{name}</h3>
        <div className={styles.techStackDate}>
          {updatedAt
            ? `수정일 : ${new Intl.DateTimeFormat("ko-KR").format(updatedAt)}`
            : `생성일 : ${new Intl.DateTimeFormat("ko-KR").format(createdAt)}`}
        </div>
      </div>
      <button className={styles.techStackLikeWrapper} onClick={onClickHeart}>
        <div className={styles.likeHeart}>
          ♡
          {clickAnimationArr.map((id) => (
            <AnimateHeart key={id} id={id} />
          ))}
        </div>
        <div className={styles.likeText}>
          {counts?.likeCount ?? 0 + likeClickCount}
        </div>
      </button>
    </div>
  );
}

function DescriptionSection({ techStack }: { techStack: CombinedTechStack }) {
  const { description } = techStack;

  const descriptionWrapperRef = useRef<HTMLDivElement | null>(null);
  const descriptionContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ref = descriptionWrapperRef.current!;
    let scrollDown = -1;
    const mouseOutCallback = () => {
      window.clearInterval(scrollDown);
    };
    const mouseOverCallback = () => {
      scrollDown = window.setInterval(function () {
        descriptionWrapperRef.current!.scrollTop += 1;
        if (
          descriptionWrapperRef.current!.scrollTop +
            descriptionWrapperRef.current!.clientHeight >=
          descriptionContentRef.current!.clientHeight
        ) {
          window.clearInterval(scrollDown);
        }
      }, 70);
      ref.addEventListener("mouseout", mouseOutCallback);
    };
    ref.addEventListener("mouseover", mouseOverCallback);
    return () => {
      ref.removeEventListener("mouseover", mouseOverCallback);
      ref.removeEventListener("mouseout", mouseOutCallback);
    };
  }, []);

  return (
    <div
      ref={descriptionWrapperRef}
      className={styles.techStackDescriptionWrapper}
    >
      <p
        ref={descriptionContentRef}
        className={styles.techStackDescriptionContent}
      >
        {description}
      </p>
    </div>
  );
}
