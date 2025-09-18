import Comment from "./Comment";
import NewComment from "./NewComment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../lib/axios";

export interface AuthorType {
  _id: string;
  username: string;
}
export interface CommentType {
  _id: string;
  author: AuthorType;
  content: string;
}

const CommentList = ({ onCountChange }: { onCountChange?: (count: number) => void }) => {
  const { id } = useParams<{ id?: string }>();
  const [comments, setComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    if (!id) return;
    const response = await instance.get<CommentType[]>(`/post/${id}/comments`);
    setComments(response.data);
    onCountChange?.(response.data.length);
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <div className="group_comment">
      <NewComment
        onCreated={(created) => {
          // Optimistic: 바로 반영
          setComments((prev) => [created, ...prev]);
          onCountChange?.(comments.length + 1);
          // 정합 보정
          fetchComments();
        }}
      />
      <ul className="comment_list">
        {comments.map((c) => (
          <li key={c._id}>
            <Comment comment={c} onUpdated={fetchComments} onDeleted={fetchComments} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
