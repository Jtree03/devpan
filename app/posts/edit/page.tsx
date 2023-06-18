import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/lib/database.types";
import { prisma } from "@/lib/prisma";

import PostEdit from "./_components/PostEdit";

type Props = {
  searchParams: {
    categoryID?: string;
    subjectID?: string;
    postID?: string;
  };
};

export default async function PostEditPage({ searchParams }: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const post = searchParams.postID
    ? await prisma.post.findFirst({
        where: {
          id: parseInt(searchParams.postID, 10),
        },
      })
    : undefined;

  const sendPost = async (
    title: string,
    content: string,
    writer: string,
    avatar: string
  ) => {
    "use server";

    if (searchParams.postID) {
      await prisma.post.update({
        where: {
          id: parseInt(searchParams.postID, 10),
        },
        data: {
          title,
          content,
          writer,
          avatar,
        },
      });
    } else {
      if (searchParams.subjectID) {
        await prisma.post.create({
          data: {
            title,
            content,
            writer,
            avatar,
            subjectID: parseInt(searchParams.subjectID, 10),
          },
        });
      }
    }
  };

  return <PostEdit session={session} post={post} sendPost={sendPost} />;
}
