import { MdModeEdit } from "react-icons/md";

const NewComment = () => {
  return (
    <div className="new_comment">
      <form action="">
        <input type="text" placeholder="내용을 입력하세요" />
        <button className="submit">
          <MdModeEdit size={18} />
          등록
        </button>
      </form>
    </div>
  );
};

export default NewComment;
