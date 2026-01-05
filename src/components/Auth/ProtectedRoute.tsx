// components/Auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import type { JSX } from "react";
import StyledLoading from "../StyledLoading";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) return <StyledLoading />;

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}
