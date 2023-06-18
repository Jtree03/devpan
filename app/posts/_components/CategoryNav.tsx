"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Category } from "@prisma/client";

import styles from "./CategoryNav.module.css";
import { useState } from "react";

type Props = {
  serverCategories: Category[];
};

export default function CategoryNav({ serverCategories }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div>
      <div className={styles.inputWrapper}>
        <input
          placeholder="스택 검색"
          className={styles.stackSearchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.eraseIcon} onClick={() => setSearch("")}>
            +
          </button>
        )}
      </div>

      <div className={styles.separator} />

      <nav>
        <ul className={styles.categoryList}>
          {serverCategories.map(
            (category) =>
              category.name.toLowerCase().includes(search.toLowerCase()) && (
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
                  onClick={() =>
                    router.push(`/posts?categoryID=${category.id}`)
                  }
                >
                  {category.name}
                </li>
              )
          )}
        </ul>
      </nav>
    </div>
  );
}
