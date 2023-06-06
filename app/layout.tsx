import { Metadata } from "next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/lib/database.types";

import "./resets.css";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "개발판",
  description: "개발과 관련된 이야기 나누는 곳",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="ko">
      <body>
        <Header session={session} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
