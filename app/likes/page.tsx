import { prisma } from "@/lib/prisma";
import TechStackCard from "./_components/TechStackCard";

import styles from "./likes.module.css";

export default async function LikesPage() {
  async function increment(id: number) {
    "use server";
    await prisma.techStackCount.upsert({
      where: { techStackID: id },
      update: { likeCount: { increment: 1 } },
      create: { techStackID: id, likeCount: 1 },
    });
  }

  const techStacks = await prisma.techStack.findMany({
    orderBy: { counts: { likeCount: "desc" } },
    include: {
      counts: true,
      category: true,
    },
  });

  return (
    <ul className={styles.techStackList}>
      {techStacks.map((techStack) => (
        <TechStackCard
          key={techStack.id}
          techStack={techStack}
          increment={increment}
        />
      ))}
    </ul>
  );
}
