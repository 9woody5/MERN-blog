import Comment from "./Comment";
import NewComment from "./NewComment";

const CommentList = () => {
  return (
    <div className="group_comment">
      <NewComment />
      <ul className="comment_list">
        <li>
          <Comment />
        </li>
        <li>
          <Comment />
        </li>
        <li>
          <Comment />
        </li>
      </ul>
    </div>
  );
};

export default CommentList;
