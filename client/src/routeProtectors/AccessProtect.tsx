import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLoder from "@/components/ui/page-loder";

function AccessProtect({
  children,
  type, // e.g. "admin", "caller", etc.
}: {
  children: React.ReactNode;
  type: string;
}) {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true }); // Not logged in
    } else if (role !== type) {
      navigate(-1 as any, { replace: true }); // Go back and replace history
    } else {
      setLoading(false); // Correct role
    }
  }, [isAuthenticated, role, type, navigate]);

  return <>{loading ? <PageLoder /> : children}</>;
}

export default AccessProtect;
