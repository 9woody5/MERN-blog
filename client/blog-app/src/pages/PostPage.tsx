import instance from "../lib/axios";
import { formatISO9075 } from "date-fns";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { PostProps } from "../components/PostList";
import CommentList from "../components/CommentList";
import { GoHeartFill } from "react-icons/go";
import { IoChatboxEllipses } from "react-icons/io5";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState<PostProps | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(0);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    instance.get(`/post/${id}`).then((response) => {
      setPostInfo(response.data);
      setLikes(response.data.likes || 0);
      setLiked(Boolean(response.data.liked));
    });
    instance.get(`/post/${id}/comments`).then((response) => setComments(response.data.length));
  }, [id]);

  const handleLike = async () => {
    if (!id) return;
    const prevLiked = liked;
    const prevLikes = likes;
    // Optimistic update
    setLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);
    try {
      const res = await instance.post(`/post/${id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (e) {
      // rollback
      setLiked(prevLiked);
      setLikes(prevLikes);
      console.error("좋아요 오류", e);
    }
  };

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

  if (!postInfo) return <div>페이지 로딩 중..</div>;

  return (
    <div className="post_page">
      <div className="post_headline">
        <h1>{postInfo.title}</h1>
        <span className="author">by @{postInfo.author.username}</span>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        {userInfo?.id === postInfo.author._id && (
          <div className="options">
            <Link className="edit_btn" to={`/edit/${postInfo._id}`}>
              수정
            </Link>
            <button className="delete_btn" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="img_box">
        <img src={`${instance.defaults.baseURL}/${postInfo.thumb.replace(/\\/g, "/")}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      <div>
        <div className="interaction_area">
          <button className="like_btn" onClick={handleLike}>
            <GoHeartFill size={22} color={liked ? "#038b83" : "#999"} />
            <span>{likes}</span>
          </button>
          <span className="comment_title">
            <IoChatboxEllipses size={22} color={comments > 0 ? "#038b83" : "#999"} />
            <span className="count">{comments}</span>
          </span>
        </div>
        <CommentList onCountChange={(n) => setComments(n)} />
      </div>
    </div>
  );
}
