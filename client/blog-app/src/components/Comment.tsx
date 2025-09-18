import styles from "../styles/Comment.module.scss";
import { CommentType } from "./CommentList";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import instance from "../lib/axios";

const Comment = ({ comment, onUpdated, onDeleted }: {
  comment: CommentType;
  onUpdated?: () => void;
  onDeleted?: () => void;
}) => {
  const { userInfo } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const canEdit = userInfo?.id === comment.author._id;

  const handleSave = async () => {
    await instance.put(`/comments/${comment._id}`, { content: editText });
    setIsEditing(false);
    onUpdated?.();
  };

  const handleDelete = async () => {
    const ok = window.confirm("댓글을 삭제할까요?");
    if (!ok) return;
    await instance.delete(`/comments/${comment._id}`);
    onDeleted?.();
  };

  return (
    <div className={styles.comment_item}>
      <div className={styles.comment_box}>
        <span className={styles.username}>{comment.author.username}</span>
        {isEditing ? (
          <div className={styles.edit_row}>
            <input className={styles.edit_input} value={editText} onChange={(e) => setEditText(e.target.value)} />
            <button className="edit_btn" onClick={handleSave}>저장</button>
            <button className="delete_btn" onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <p className={styles.content}>{comment.content}</p>
        )}
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {canEdit && !isEditing && (
            <button className="edit_btn" onClick={() => setIsEditing(true)}>수정</button>
          )}
          {canEdit && (
            <button className="delete_btn" onClick={handleDelete}>삭제</button>
          )}
        </span>
      </div>
    </div>
  );
};

export default Comment;
