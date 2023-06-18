import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import RealtimePost from "./_components/RealtimePost";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { cookies } from "next/headers";

type Props = {
  params: { postID: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { postID } = params;

  if (!postID) {
    notFound();
  }

  const post = await prisma.post.findFirst({
    where: { id: parseInt(postID, 10) },
  });

  if (!post) {
    notFound();
  }
  return {
    title: `${post.title} | Devpan`,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { postID } = params;

  if (!postID) {
    notFound();
  }

  const post = await prisma.post.findFirst({
    where: { id: parseInt(postID, 10) },
    include: {
      subject: { include: { category: true } },
      counts: true,
    },
  });

  if (!post) {
    notFound();
  }

  await prisma.post.update({
    where: { id: parseInt(postID, 10) },
    data: {
      counts: {
        upsert: {
          create: {
            viewCount: 1,
          },
          update: {
            viewCount: {
              increment: 1,
            },
          },
        },
      },
    },
  });

  const incrementLikeCount = async () => {
    "use server";
    const supabase = createServerComponentClient<Database>({ cookies });
    const userResponse = await supabase.auth.getUser();
    if (!userResponse.data.user) {
      return;
    }
    const updateCountQuery = prisma.post.update({
      where: { id: parseInt(postID, 10) },
      data: {
        counts: {
          upsert: {
            create: {
              likeCount: 1,
            },
            update: {
              likeCount: {
                increment: 1,
              },
            },
          },
        },
      },
    });
    const updateLikeQuery = prisma.postLike.create({
      data: {
        postID: parseInt(postID, 10),
        userID: userResponse.data.user.id,
      },
    });
    await prisma.$transaction([updateCountQuery, updateLikeQuery]);
  };

  const decrementLikeCount = async () => {
    "use server";
    const supabase = createServerComponentClient<Database>({ cookies });
    const userResponse = await supabase.auth.getUser();
    if (!userResponse.data.user) {
      return;
    }
    const updateCountQuery = prisma.post.update({
      where: { id: parseInt(postID, 10) },
      data: {
        counts: {
          upsert: {
            create: {
              likeCount: 0,
            },
            update: {
              likeCount: {
                decrement: 1,
              },
            },
          },
        },
      },
    });
    const deleteLikeQuery = prisma.postLike.deleteMany({
      where: {
        postID: parseInt(postID, 10),
        userID: userResponse.data.user.id,
      },
    });
    await prisma.$transaction([updateCountQuery, deleteLikeQuery]);
  };

  const incrementOrDecrementLikeCount = async () => {
    "use server";
    const supabase = createServerComponentClient<Database>({ cookies });
    const userResponse = await supabase.auth.getUser();
    if (!userResponse.data.user) {
      return;
    }
    const like = await prisma.postLike.findFirst({
      where: {
        postID: parseInt(postID, 10),
        userID: userResponse.data.user.id,
      },
    });
    if (like) {
      await decrementLikeCount();
    } else {
      await incrementLikeCount();
    }
  };

  const supabase = createServerComponentClient<Database>({ cookies });
  const userResponse = await supabase.auth.getUser();
  const postLike =
    userResponse.data.user?.id &&
    (await prisma.postLike.findFirst({
      where: {
        postID: parseInt(postID, 10),
        userID: userResponse.data.user.id,
      },
    }));

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <RealtimePost
      serverPost={post}
      incrementOrDecrementLikeCount={incrementOrDecrementLikeCount}
      postLike={!!postLike}
      session={session}
    />
  );
}
