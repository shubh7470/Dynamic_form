import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import type { AppDispatch } from "./store";
import { useDispatch } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { login, logout } from "./reducer/auth";
import Login from "./pages/auth/Login";
import { SuperAdminLogin } from "./pages/auth/superAdmin";
import LoginRP from "./routeProtectors/LoginRP";
import AccessProtect from "./routeProtectors/AccessProtect";
import SuperAdminProtect from "./routeProtectors/SuperAdminProtect";
import SuperAdminLoginRP from "./routeProtectors/SuperAdminLoginRP";
// import Dashboard from "./pages/admin/Dashboard";
import { AdminRoutes } from "./routes/AdminRoutes";
import Layout from "./layouts/admin/Layout";
import PageLoder from "./components/ui/page-loder";
import SuperAdminPanel from "./pages/superAdmin/superAdmin";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loding, setLoding] = useState(true);
  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const user = JSON.parse(userData);
      dispatch(
        login({
          isAuthenticated: true,
          user: user,
          role: user.role,
        })
      );
    } else {
      // Reset Redux state when no userData in localStorage
      dispatch(logout());
    }
    setLoding(false);
  }, [dispatch]);

  return (
    <>
      {loding ? (
        <h1>loding</h1>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <LoginRP>
                  <Login />
                </LoginRP>
              }
            />
            <Route
              path="/super-admin/login"
              element={
                <SuperAdminLoginRP>
                  <SuperAdminLogin />
                </SuperAdminLoginRP>
              }
            />
            <Route
              path="/admin"
              element={
                <AccessProtect type="admin">
                  <Suspense fallback={<PageLoder />}>
                    <Layout />
                  </Suspense>
                </AccessProtect>
              }
            >
              {AdminRoutes}
            </Route>
            
            <Route
              path="/admin/super-admin"
              element={
                <SuperAdminProtect>
                  <Suspense fallback={<PageLoder />}>
                    <SuperAdminPanel />
                  </Suspense>
                </SuperAdminProtect>
              }
            />
            
            {/* Remove the standalone super-admin route */}
            {/* <Route
              path="/super-admin"
              element={
               <SuperAdminPanel />
              }
            /> */}
          </Routes>

        </BrowserRouter>
      )}
    </>
  );
}

export default App;
// This file is the main entry point for the React application.