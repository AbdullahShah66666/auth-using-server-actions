import { Suspense } from "react";
import LoginClient from "./LoginClient";

function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}

export default Login;