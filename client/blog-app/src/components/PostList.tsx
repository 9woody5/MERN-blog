import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import styles from "../styles/PostList.module.scss";

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
    <Link to={`/post/${_id}`} className={styles.post}>
      <div className={styles.post_wrapper}>
        <div className={styles.img_box}>
          <img src={`http://localhost:4000/${thumb.replace(/\\/g, "/")}`} alt="" />
        </div>
        <div className={styles.texts}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.info}>
            <span className={styles.author}>{author.username}</span>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className={styles.summary}>{summary}</p>
        </div>
      </div>
    </Link>
  );
};

export default Post;
