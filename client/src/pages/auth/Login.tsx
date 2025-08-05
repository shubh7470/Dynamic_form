import { useForm } from "react-hook-form";
import type { LoginDataType } from "../../schemas/login";
import { loginSchema } from "../../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import styled, { keyframes } from "styled-components";
import LoginIMG from "../../assets/images/loginPageIMG.png";
import { loginAPI } from "@/API/services/authService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { login } from "@/reducer/auth";
import { toast } from "sonner";
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GradientDiv = styled.div`
  height: 100vh;
  background: linear-gradient(
    45deg,
    rgba(238, 119, 82, 0.6),
    rgba(231, 60, 126, 0.6),
    rgba(35, 166, 213, 0.6),
    rgba(35, 213, 171, 0.6)
  );
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
`;

function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginDataType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "", // default email value
      password: "", // default password value     // default checkbox (unchecked)
    },
  });
  const onSubmit = (data: LoginDataType) => {
    loginAPI(data)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          toast.success("Login successfully");
          dispatch(
            login({
              isAuthenticated: true,
              user: res.data.data.user,
              role: res.data.data.user.role,
            })
          );
          localStorage.setItem("userData", JSON.stringify(res.data.data.user));
          localStorage.setItem("token", res.data.data.accessToken);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          toast.error("Invalid email or password");
          reset();
        } else if (err.response.status === 500) {
          toast.error("Internal server error");
        }
      });
  };
  return (
    <GradientDiv>
      <div className="w-full h-screen flex justify-center items-center px-11 py-20 ">
        <div className="w-full h-full flex flex-col lg:flex-row justify-between items-center bg-black/[0.4] backdrop-blur-sm rounded-lg overflow-hidden max-w-[1050px]">
          <div className="lg:w-[50%] w-full h-full flex justify-center items-center flex-col">
            <img
              src={LoginIMG}
              className="lg:w-[70%] w-[50%] min-w-[300px]"
              alt="login"
            />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:w-[50%] w-full h-full bg-white flex justify-center items-center flex-col gap-4 pb-4"
          >
            <CardContent className="lg:w-[70%] w-[50%] min-w-[300px]">
              <h1 className="text-lg text-black font-bold mb-4 w-full text-center">
                Login
              </h1>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter Email"
                    {...register("email")}
                    className={
                      errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    {...register("password")}
                    className={
                      errors.password ? "border-red-500 focus:ring-red-500" : ""
                    }
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </CardContent>
          </form>
        </div>
      </div>
    </GradientDiv>
  );
}

export default Login;
