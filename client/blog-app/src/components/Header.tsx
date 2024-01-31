import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import instance from "../lib/axios";
import { UserContext, UserInfo } from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await instance.get("/user/profile");
        if (response.status === 200) {
          const userData: UserInfo = response.data;
          setUserInfo(userData);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error("요청 오류", error);
      }
    };
    loadUserInfo();
  }, []);

  function logout() {
    instance
      .post("/user/logout")
      .then((response) => {
        if (response.data === "Ok") {
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.error("로그아웃 오류", error);
      });
    setUserInfo(null);
  }

  // username이 new일 경우를 대비해서 optional props 설정
  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <span>Hi, {username}</span>
            <Link to="/create">글 쓰기</Link>
            <a onClick={logout}>로그아웃</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}
