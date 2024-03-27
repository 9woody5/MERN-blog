import { useParams } from "react-router-dom";
import styles from "../styles/Comment.module.scss";
import { useState, useEffect } from "react";
import instance from "../lib/axios";

interface AuthorType {
  _id: string;
  username: string;
}
interface CommentType {
  _id: string;
  author: AuthorType;
  content: string;
}

const Comment = () => {
  const { id } = useParams<{ id?: string }>();
  const [comments, setComments] = useState<CommentType[]>([]);
  console.log(id);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await instance.get<CommentType[]>(`/post/${id}/comments`);
        setComments(response.data);
        console.log("댓글 출력");
      } catch (err) {
        console.error("댓글 조회 오류", err);
      }
    };

    getComments();
  }, [id]);

  return (
    <>
      {comments.map((comment) => (
        <div key={comment._id} className={styles.comment_item}>
          <div className={styles.comment_box}>
            <span className={styles.username}>{comment.author.username}</span>
            <p className={styles.content}>{comment.content}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Comment;
