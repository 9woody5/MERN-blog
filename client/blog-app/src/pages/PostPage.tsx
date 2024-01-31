import instance from "../lib/axios";
import { formatISO9075 } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { PostProps } from "../components/Post";
import CommentList from "../components/CommentList";
import { GoHeartFill } from "react-icons/go";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState<PostProps | null>(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    instance.get(`/post/${id}`).then((response) => setPostInfo(response.data));
  }, [id]);

  const handleDelete = async () => {
    const userConfirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (userConfirmed) {
      try {
        await instance.delete(`/post/${id}`);
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
      <div className="post_headline">
        <h1>{postInfo.title}</h1>
        <span className="author">by @{postInfo.author.username}</span>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
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
        <button className="like_btn">
          <GoHeartFill size={35} color="#f50d53" />
          <span>35</span>
        </button>
      </div>
      <div className="img_box">
        <img src={`http://localhost:4000/${postInfo?.thumb}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      <CommentList />
    </div>
  );
}
