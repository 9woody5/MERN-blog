import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import { UserContext, UserInfo } from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
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
    axios
      .post(
        "http://localhost:4000/logout",
        {},
        {
          withCredentials: true,
        }
      )
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
            <Link to="/create">글 쓰기</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
