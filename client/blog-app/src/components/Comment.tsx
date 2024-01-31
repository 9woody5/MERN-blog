import styles from "../styles/Comment.module.scss";

const Comment = () => {
  return (
    <div className={styles.comment_item}>
      <div className={styles.comment_box}>
        <span className={styles.username}>작성자1</span>
        <p className={styles.content}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia aspernatur atque voluptate! Obcaecati, ea
          optio? Illum delectus molestiae nobis! Voluptatum repellendus perferendis voluptatibus in ad exercitationem
          ducimus molestiae obcaecati magni!
        </p>
      </div>
    </div>
  );
};

export default Comment;
