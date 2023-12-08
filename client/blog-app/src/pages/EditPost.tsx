import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import axios from "axios";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  // const [thumb, setThumb] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/post/${id}`).then((response) => {
      setTitle(response.data.title);
      setContent(response.data.content);
      setSummary(response.data.summary);
    });
  }, [id]);

  async function updatePost(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id || "");
    if (files) {
      data.set("file", files[0]);
    }
    const response = await axios.put("http://localhost:4000/post", data, {
      withCredentials: true,
    });

    if (response.status === 200) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title" placeholder="{'Title'}" value={title} onChange={(event) => setTitle(event.target.value)} />
      <input
        type="summary"
        placeholder="{'Summary'}"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <input type="file" onChange={(event) => setFiles(event.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: 5 }}>Update Post</button>
    </form>
  );
}
