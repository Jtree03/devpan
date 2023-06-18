"use client";

import "@toast-ui/editor/dist/toastui-editor.css";

import { useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Editor } from "@toast-ui/react-editor";

import DevpanSVG from "@/asset/devpan.svg";
import { Database } from "@/lib/database.types";
import { Post } from "@prisma/client";

import styles from "./PostEdit.module.css";

// const Editor = dynamic(
//   () => import("@toast-ui/react-editor"),
//   { ssr: false }
// );

type Props = {
  session?: Session | null;
  post?: Post | null;
  sendPost: (
    title: string,
    content: string,
    writer: string,
    avatar: string
  ) => Promise<void>;
};

function PostEdit({ session, post, sendPost }: Props) {
  const router = useRouter();
  const ref = useRef<Editor | null>(null);
  const supabaseClient = createClientComponentClient<Database>();

  const onClickSend = async (formData: FormData) => {
    const title = formData.get("title")?.toString();
    const writer = formData.get("writer")?.toString();
    const avatar = formData.get("avatar")?.toString() ?? "";
    const content = ref.current?.getInstance().getMarkdown();

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!writer) {
      alert("글쓴이를 입력해주세요.");
      return;
    }
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    await sendPost(title, content, writer, avatar);
    router.back();
    router.refresh();
  };

  return (
    <form className={styles.box} action={(formData) => onClickSend(formData)}>
      <div className={styles.header}>
        <input
          name="title"
          className={styles.titleInput}
          placeholder="제목 입력"
          autoFocus
          defaultValue={post?.title ?? ""}
        />
        <div className={styles.info}>
          <div className={styles.writerWrapper}>
            <input
              name="avatar"
              hidden
              defaultValue={
                post?.avatar || session?.user.user_metadata.avatar_url || ""
              }
            />
            <Image
              alt="avatar"
              src={
                post?.avatar ||
                session?.user.user_metadata.avatar_url ||
                DevpanSVG
              }
              width={20}
              height={20}
            />
            <input
              name="writer"
              defaultValue={
                post?.writer || session?.user.user_metadata.user_name || ""
              }
              className={styles.writerInput}
              readOnly={post?.writer || session?.user.user_metadata.user_name}
              placeholder="글쓴이 입력"
            />
          </div>
          <div>
            <button className={styles.sendButton}>등록</button>
          </div>
        </div>
      </div>
      <Editor
        ref={ref}
        onLoad={(editor) => (ref.current = editor)}
        previewHighlight={false}
        initialValue={post?.content ?? ""}
        previewStyle="vertical"
        height="400px"
        hooks={{
          addImageBlobHook: async (file, callback) => {
            const extension = file.type.split("/")[1];
            const result = await supabaseClient.storage
              .from("post-upload")
              .upload(`${crypto.randomUUID()}.${extension}`, file);
            if (!result.data) {
              throw new Error("image upload failed");
            }
            const { data } = supabaseClient.storage
              .from("post-upload")
              .getPublicUrl(result.data.path);
            callback(data.publicUrl);
          },
        }}
      />
    </form>
  );
}

export default PostEdit;
