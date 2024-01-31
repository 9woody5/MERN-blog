import instance from "../lib/axios";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { PostProps } from "../components/Post";

export default function IndexPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);

  // 홈페이지에 mount 했을 때 실행할 내용
  useEffect(() => {
    instance
      .get("/post")
      .then((response) => {
        // 데이터는 response.data에서 사용할 수 있습니다.
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류가 발생했습니다: ", error);
      });
  }, []);

  return <>{posts.length > 0 && posts.map((post: PostProps, id: number) => <Post key={id} {...post} />)}</>;
}
