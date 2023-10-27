import { useState, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await axios.post("http://localhost:4000/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        // axios request에도 cookie 정보가 포함되도록 설정
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo(response.data);
        setRedirect(true);
      } else {
        alert("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("요청 오류", error);
      alert("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }
  {
    //메인 화면으로 redirect
    if (redirect) {
      return <Navigate to={"/"} />;
    }
  }
  return (
    <form className="login_form" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(event) => setUserName(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
