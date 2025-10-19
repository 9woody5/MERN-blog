import instance from "../lib/axios";
import Post from "../components/PostList";
import { useEffect, useState } from "react";
import { PostProps } from "../components/PostList";
import styles from "../styles/PostList.module.scss";

export default function IndexPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 홈페이지에 mount 했을 때 실행할 내용
  useEffect(() => {
    const params = { page: 1, limit: 12 };

    instance
      .get("/post", { params })
      .then((response) => {
        setPosts(response.data.posts || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류가 발생했습니다: ", error);
        setError("데이터를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.list_wrapper}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.list_wrapper}>오류: {error}</div>;
  }

  return (
    <div className={styles.list_wrapper}>
      {posts.length > 0 &&
        posts.map((post: PostProps, id: number) => <Post key={id} {...post} />)}
    </div>
  );
}
