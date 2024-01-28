import axios from "axios";
import { formatISO9075 } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { PostProps } from "../Post";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState<PostProps | null>(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/post/${id}`).then((response) => setPostInfo(response.data));
  }, [id]);

  const handleDelete = async () => {
    const userConfirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (userConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/post/${id}`, {
          withCredentials: true,
        });
        alert("게시글이 삭제되었습니다 ✅");
        navigate("/");
      } catch (error) {
        console.error("게시글 삭제 오류", error);
      }
    }
  };

  if (!postInfo) return <div>Loading..</div>;

  return (
    <div className="post_page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <span className="author">by @{postInfo.author.username}</span>
      {userInfo?.id === postInfo.author._id && (
        <div className="options">
          <Link className="edit_btn" to={`/edit/${postInfo._id}`}>
            <FaEdit size={17} />
            수정
          </Link>
          <button className="delete_btn" onClick={handleDelete}>
            <MdDelete size={20} />
            삭제
          </button>
        </div>
      )}
      <div className="img_box">
        <img src={`http://localhost:4000/${postInfo?.thumb}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      <div className="comment_box">
        <span>댓글</span>
      </div>
    </div>
  );
}
