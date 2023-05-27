import styles from "./page.module.css";
import { prismaClient } from "./_lib/prismaClient";
import TechStackCard from "./_components/TechStackCard";

export default async function Home() {
  async function increment(id: number) {
    "use server";
    await prismaClient.techStack.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  const techStacks = await prismaClient.techStack.findMany({
    orderBy: { likeCount: "desc" },
  });

  return (
    <main className={styles.main}>
      <ul className={styles.techStackList}>
        {techStacks.map((techStack) => (
          <li key={techStack.id} className={styles.techStackItem}>
            <TechStackCard techStack={techStack} increment={increment} />
          </li>
        ))}
      </ul>
    </main>
  );
}
