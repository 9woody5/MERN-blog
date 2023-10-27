import { useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  function createNewPost(e: React.FormEvent) {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files) {
      data.set("files", files[0]);
    }
    axios.post("http://localhost:4000/post", data, {});
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
      <ReactQuill value={content} onChange={(newValue) => setContent(newValue)} modules={modules} formats={formats} />
      <button style={{ marginTop: 5 }}>Create Post</button>
    </form>
  );
}
