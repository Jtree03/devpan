"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Subject } from "@prisma/client";

import styles from "./SubjectNav.module.css";

type Props = {
  serverSubjects: Subject[];
};

export default function SubjectNav({ serverSubjects }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <nav>
      <ul className={styles.subjectList}>
        <li
          className={styles.subjectItem}
          style={{
            color: !searchParams.get("subjectID") ? "black" : undefined,
          }}
          onClick={() =>
            router.push(`${pathname}?${removeQueryString("subjectID")}`)
          }
        >
          전체
        </li>
        {serverSubjects.map((subject) => (
          <li
            key={subject.id}
            className={styles.subjectItem}
            style={{
              color:
                searchParams.get("subjectID") === subject.id.toString()
                  ? "black"
                  : undefined,
            }}
            onClick={() =>
              router.push(
                `${pathname}?${createQueryString(
                  "subjectID",
                  subject.id.toString()
                )}`
              )
            }
          >
            {subject.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
