import instance from "../lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      if (files) {
        data.set("file", files[0]);
      }
      const response = await instance.post("/post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.status === 400) {
        console.error("요청 오류", err);
        alert("제목, 썸네일 이미지, 내용은 필수 입력 항목입니다❗");
      }
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input type="title" placeholder="{'Title'}" value={title} onChange={(event) => setTitle(event.target.value)} />
      <input
        type="summary"
        placeholder="{'Summary'}"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <input type="file" onChange={(event) => setFiles(event.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: 5 }}>Create Post</button>
    </form>
  );
}
