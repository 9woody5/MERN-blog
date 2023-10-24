import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [username, setUsername] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", {
        withCredentials: true,
      })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("요청 오류", error);
      });
  }, []);
  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">글 쓰기</Link>
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
