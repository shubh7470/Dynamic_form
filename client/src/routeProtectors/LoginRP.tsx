import { useSelector } from "react-redux";
import type { RootState } from "../store/index";
import { Navigate } from "react-router-dom";
function LoginRP({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // console.log(isAuthenticated, user, role);

  if (isAuthenticated) {
    // If already logged in and trying to go to /login, block and stay
    return <Navigate to={"/admin"} replace />;
  }

  return children;
}

export default LoginRP;
