import instance from "../lib/axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormValue } from "./LoginPage";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function RegisterPage() {
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValue>({ mode: "onChange" });

  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await instance.get(`/user/check-username?username=${username}`);
      return response.data.available;
    } catch (error) {
      console.error("유저 이름 확인 오류", error);
      return false;
    }
  };

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    const isUsernameAvailable = await checkUsernameAvailability(data.username);
    if (!isUsernameAvailable) {
      setError("username", {
        type: "validate",
        message: "이미 사용 중인 유저 이름입니다.",
      });
      return;
    }

    try {
      const response = await instance.post("/user/register");
      console.log("요청 성공", response.data);
      setErrMsg(null);
      alert("회원 가입이 완료되었습니다!");
    } catch (error: any) {
      console.error("요청 오류", error);
      setErrMsg("가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <form method="POST" className="register_form" onSubmit={handleSubmit(onSubmit)}>
      <h1>회원가입</h1>
      <input
        type="text"
        placeholder="username"
        {...register("username", {
          required: "유저 이름은 필수 입력 사항입니다.",
          validate: (value) => checkUsernameAvailability(value),
        })}
      />
      {errors.username && <small role="alert">{errors.username.message}</small>}

      <input
        type="password"
        placeholder="password"
        {...register("password", {
          required: "비밀번호는 필수 입력 사항입니다.",
        })}
      />
      {errors.password && <small role="alert">{errors.password.message}</small>}
      {errMsg && (
        <Alert severity="error">
          <AlertTitle>오류</AlertTitle>
          {errMsg}
        </Alert>
      )}
      <button type="submit">가입하기</button>
    </form>
  );
}
