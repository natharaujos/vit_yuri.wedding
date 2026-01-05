import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { Navigate } from "react-router-dom";
import admins from "../../constants/admins";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF7F]"></div>
      </div>
    );
  }

  if (!user || !admins.includes(user.email || "")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
