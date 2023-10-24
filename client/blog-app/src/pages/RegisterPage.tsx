import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  async function register(e: React.FormEvent) {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await axios.post("http://localhost:4000/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("요청 성공", response.data);
      alert("회원 가입이 완료되었습니다!");
    } catch (error) {
      console.error("요청 오류", error);
      alert("가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form className="register_form" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
