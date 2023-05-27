"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TechStack } from "@prisma/client";

import AnimateHeart from "./AnimateHeart";
import styles from "./TechStackCard.module.css";

type Props = { techStack: TechStack; increment: (id: number) => Promise<void> };

function TechStackCard(props: Props) {
  const { techStack, increment } = props;

  return (
    <div className={styles.techStackCard}>
      <ImageSection image={techStack.image} />
      <InfoSection {...techStack} increment={increment} />
      <DescriptionSection description={techStack.description} />
    </div>
  );
}

export default TechStackCard;

function ImageSection({ image }: { image: string }) {
  return (
    <div className={styles.techStackImageWrapper}>
      <Image
        alt="tech_image"
        src={image}
        fill
        className={styles.techStackImage}
      />
    </div>
  );
}

function InfoSection({
  id,
  name,
  likeCount,
  createdAt,
  updatedAt,
  increment,
}: TechStack & {
  increment: (id: number) => Promise<void>;
}) {
  const autoIncrement = useRef(0);
  const [clickAnimationArr, setClickAnimationArr] = useState<number[]>([]);
  const [likeClickCount, setLikeClickCount] = useState(0);

  const onClickHeart = async () => {
    setLikeClickCount((prev) => prev + 1);
    setClickAnimationArr((prev) => [...prev, autoIncrement.current++]);
    await increment(id);
  };

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
        <div className={styles.likeText}>{likeCount + likeClickCount}</div>
      </button>
    </div>
  );
}

function DescriptionSection({ description }: { description: string }) {
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
