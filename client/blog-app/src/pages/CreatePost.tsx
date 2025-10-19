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
      const response = await instance.post("/post", data);
      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("전체 에러 정보:", err.response);
        console.error("응답 데이터:", err.response?.data);
        console.error("응답 상태:", err.response?.status);

        if (err.response?.status === 400) {
          alert(
            `서버 에러: ${err.response.data?.message || "알 수 없는 오류"}`
          );
        }
      }
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="제목"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="summary"
        placeholder="한 줄 소개"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <input type="file" onChange={(event) => setFiles(event.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: 5 }}>게시글 등록하기</button>
    </form>
  );
}
