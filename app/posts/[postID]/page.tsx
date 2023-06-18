import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import RealtimePost from "./_components/RealtimePost";

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

  return <RealtimePost serverPost={post} />;
}
