import instance from "../lib/axios";
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
