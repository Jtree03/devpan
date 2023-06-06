"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Category } from "@prisma/client";

import styles from "./CategoryNav.module.css";

type Props = {
  serverCategories: Category[];
};

export default function CategoryNav({ serverCategories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div>
      <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>스택</h3>
      <nav>
        <ul className={styles.categoryList}>
          {serverCategories.map((category) => (
            <li
              key={category.id}
              className={styles.categoryItem}
              style={{
                color:
                  (!searchParams.get("categoryID") &&
                    category.name === "개발판") ||
                  searchParams.get("categoryID") === category.id.toString()
                    ? "black"
                    : undefined,
              }}
              onClick={() => router.push(`/posts?categoryID=${category.id}`)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
