"use client";

import { Database } from "@/lib/database.types";
import { Post } from "@prisma/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

type Props = {
  serverPost: Post;
};

function RealtimePost({ serverPost }: Props) {
  const supabase = createClientComponentClient<Database>();
  const [post, setPost] = useState(serverPost);

  useEffect(() => {
    setPost(serverPost);
  }, [serverPost]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime post")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Post",
          filter: `id=eq.${post.id}`,
        },
        (payload) => {
          setPost(payload.new as Post);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, post, setPost]);

  return <pre>{JSON.stringify(post, null, 2)}</pre>;
}

export default RealtimePost;
