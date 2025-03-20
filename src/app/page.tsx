import LoginForm from "@/components/login/LoginForm";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
        <LoginForm/>
      </div>
    </div>
  );
};

export default LoginPage;
