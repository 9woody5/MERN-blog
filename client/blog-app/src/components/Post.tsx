import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export interface PostProps {
  _id: string;
  title: string;
  summary: string;
  thumb: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    _id: string;
  };
}

const Post: React.FC<PostProps> = ({ _id, title, summary, thumb, createdAt, author }) => {
  return (
    <div className="post">
      <div className="img_box">
        <Link to={`/post/${_id}`}>
          <img src={`http://localhost:4000/${thumb.replace(/\\/g, "/")}`} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2 className="title">{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
