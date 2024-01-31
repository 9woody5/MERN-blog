/* eslint-disable @typescript-eslint/no-unused-vars */
import instance from "../lib/axios";
import { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export interface FormValue {
  username: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({ mode: "onChange" });

  const [redirect, setRedirect] = useState<boolean>(false);
  const { setUserInfo } = useContext(UserContext);

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    try {
      const response = await instance.post("/user/login", data);
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
  };
  //메인 화면으로 redirect
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        {...register("username", {
          required: "유저 이름은 필수 입력 사항입니다.",
        })}
      />
      {errors.username && <small role="alert">{errors.username.message}</small>}
      <input
        type="password"
        placeholder="password"
        {...register("password", {
          required: "비밀 번호는 필수 입력 사항입니다",
        })}
      />
      {errors.password && <small role="alert">{errors.password.message}</small>}
      <button type="submit">Login</button>
    </form>
  );
}
