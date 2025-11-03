import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import useNavegation from "../../hooks/useNavegation";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import img from "../../assets/logo-CONICET_opt.png";

const Login = () => {
  const { password, handleSavePassword, fetchGetUserByPassword, isLogin } = useUserContext();
  const { goHome } = useNavegation();

  useEffect(() => {
    if (isLogin) {
      // Marcar que es un login nuevo
      sessionStorage.setItem('newLogin', 'true');
      goHome();
    }
  }, [isLogin, goHome]);

  return (
    <div className="flex h-screen">
      {/* LADO IZQUIERDO - Fondo azul y logo */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center">
        <div className="flex flex-col items-center text-white">
          <img
            src={img}
            alt="CONICET"
            className="w-40 mb-6 drop-shadow-lg"
          />
          <h1 className="text-3xl font-semibold tracking-wide">CONICET</h1>
        </div>
      </div>

      {/* LADO DERECHO - Formulario de login */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <form
          onSubmit={fetchGetUserByPassword}
          className="bg-white p-10 rounded-2xl shadow-lg w-96 flex flex-col space-y-6"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
            Login
          </h2>

          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-5 py-3 border border-gray-200">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handleSavePassword}
              className="bg-transparent outline-none flex-1 text-gray-900 placeholder-gray-400"
            />
            <Lock className="w-5 h-5 text-gray-500" />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-full font-medium text-lg hover:bg-blue-700 transition"
          >
            <LogIn className="w-5 h-5" />
            Entrar
          </button>

          <button
            type="button"
            onClick={goHome}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 py-3 rounded-full font-medium text-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;