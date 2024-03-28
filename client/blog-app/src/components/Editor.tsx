import ReactQuill, { Quill } from "react-quill";
// import ImageResize from "quill-image-resize";
// Quill.register("modules/ImageResize", ImageResize);
interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],

  // ImageResize: {
  //   parchment: Quill.import("parchment"),
  // },
};

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <ReactQuill
      value={value}
      theme={"snow"}
      onChange={onChange}
      modules={modules}
      style={{ height: "300px", overflowY: "auto" }}
    />
  );
}
