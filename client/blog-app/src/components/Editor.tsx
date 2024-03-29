import ReactQuill, { Quill } from "react-quill";
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
Quill.register("modules/ImageActions", ImageActions);
Quill.register("modules/ImageFormats", ImageFormats);

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const formats = [
  "width",
  "height",
  "header",
  "font",
  "size",
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
  "color",
  "align",
  "float",
  "alt",
  "style",
];

const modules = {
  ImageActions: {},
  ImageFormats: {},
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <ReactQuill
      value={value}
      formats={formats}
      theme={"snow"}
      onChange={onChange}
      modules={modules}
      style={{ height: "400px", overflowY: "auto" }}
    />
  );
}
