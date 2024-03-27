import styles from "../styles/Comment.module.scss";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import instance from "../lib/axios";
import { useParams } from "react-router-dom";

const NewComment = () => {
  const { userInfo } = useContext(UserContext);
  const [commentContent, setCommentContent] = useState("");
  const { id } = useParams();

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await instance.post(`/post/${id}/comments`, {
        content: commentContent,
        author: userInfo.id,
        post: id,
      });

      console.log("댓글 등록 완료", response.data);
      setCommentContent("");
    } catch (err) {
      console.error("댓글 등록 실패", err);
    }
  };

  return (
    <div className={styles.new_comment}>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentContent} // 추가된 부분
          onChange={(e) => setCommentContent(e.target.value)} // 추가된 부분
          placeholder={userInfo?.id ? "내용을 입력하세요" : "댓글을 작성하려면 로그인이 필요합니다."}
          disabled={!userInfo?.id}
        />
        <button className={styles.submit} disabled={!userInfo?.id} type="submit">
          등록
        </button>
      </form>
    </div>
  );
};

export default NewComment;
