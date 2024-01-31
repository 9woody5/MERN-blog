import Comment from "./Comment";
import NewComment from "./NewComment";

const CommentList = () => {
  return (
    <div className="group_comment">
      <ul className="comment_list">
        <span>댓글</span>
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
      <NewComment />
    </div>
  );
};

export default CommentList;
