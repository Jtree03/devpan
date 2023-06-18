"use client";

import { useEffect, useState } from "react";
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
  const [clientSession, setClientSession] = useState(session);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setClientSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
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
        {clientSession ? (
          <div className={styles.profile}>
            <Image
              alt="profile"
              src={clientSession.user.user_metadata.avatar_url}
              width={32}
              height={32}
            />
            <span>{clientSession.user.user_metadata.user_name}</span>
            <button onClick={handleGithubLogout}>logout</button>
          </div>
        ) : (
          <button onClick={handleGithubSignIn}>깃허브로 로그인</button>
        )}
      </div>
    </header>
  );
}
