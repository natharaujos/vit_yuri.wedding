import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

interface GoogleLoginProps {
  onLogin: (user: User) => void;
}

function GoogleLogin({ onLogin }: GoogleLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  const { setLoadingWithDelay } = useLoading();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user);
      setLoadingWithDelay(true);
      navigate(redirectTo, { replace: true });
      setLoadingWithDelay(false);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4D4C1] to-[#D4AF7F] px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-8 text-center animate-fadeIn">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 mb-6">
              Não conseguimos realizar seu login no momento. Tente novamente
              clicando abaixo.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#D4AF7F] hover:bg-[#c2966c] text-white font-semibold py-3 rounded-md transition shadow"
            >
              Tentar novamente
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-[#D4AF7F] mb-6">
              Entrar com Google
            </h2>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-md transition disabled:opacity-50 shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-6 h-6"
              >
                <path
                  fill="#fbbb00"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.39 3.773-5.345 6.5-11.303 6.5-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.844 1.137 7.961 2.991l5.657-5.657C34.045 7.488 29.427 6 24 6 12.954 6 4 14.954 4 26s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.153-2.637-.389-3.917z"
                />
                <path
                  fill="#518ef8"
                  d="M6.306 14.691l6.571 4.819C14.56 17.127 19.835 14 24 14c3.059 0 5.844 1.137 7.961 2.991l5.657-5.657C34.045 7.488 29.427 6 24 6 16.318 6 9.344 10.985 6.306 14.691z"
                />
                <path
                  fill="#28b446"
                  d="M24 44c5.421 0 10.287-1.955 13.986-5.188l-6.475-5.529C29.397 35.84 26.796 37 24 37c-5.993 0-11.123-4.082-12.914-9.58l-6.603 5.073C8.565 39.842 15.745 44 24 44z"
                />
                <path
                  fill="#f14336"
                  d="M43.611 20.083H42V20H24v8h11.303c-.77 2.098-2.366 3.855-4.404 4.994l6.475 5.529C39.72 34.712 44 30.04 44 24c0-1.341-.153-2.637-.389-3.917z"
                />
              </svg>
              {loading ? "Carregando..." : "Entrar com Google"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GoogleLogin;
