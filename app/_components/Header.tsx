"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

import { Database } from "@/lib/database.types";
import DevpanLogo from "@/asset/devpan.svg";

import styles from "./Header.module.css";

type Props = {
  session: Session | null;
};

export default function Header({ session }: Props) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    router.refresh();
  };

  const handleGithubLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title} onClick={() => router.push("/")}>
          <Image alt="logo" src={DevpanLogo} width={30} />
          개발판
        </div>
        <div>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/posts")}
          >
            게시판
          </button>
        </div>
        <div>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/likes")}
          >
            좋아요
          </button>
        </div>
      </div>
      <div>
        {session ? (
          <div className={styles.profile}>
            <Image
              alt="profile"
              src={session.user.user_metadata.avatar_url}
              width={32}
              height={32}
            />
            <span>{session.user.user_metadata.user_name}</span>
            <button onClick={handleGithubLogout}>logout</button>
          </div>
        ) : (
          <button onClick={handleGithubSignIn}>깃허브로 로그인</button>
        )}
      </div>
    </header>
  );
}
