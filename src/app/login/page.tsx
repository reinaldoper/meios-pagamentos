"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import dynamic from "next/dynamic";
import animationData from "../../../public/animations/login.json";
import { toast } from "react-toastify";
import Cookies from "js-cookie";


const Player = dynamic(() => import("lottie-react"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      Cookies.set("__session", "true", { path: "/" });
      toast.success("Sucesso ao logar!");
      router.push("/dashboard");
    } catch (err: Error | unknown) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4 transform transition-all hover:scale-105"
      >
        <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Login
        </h1>

        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-4 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none"
        >
          Entrar
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Não tem uma conta?{" "}
          <a
            className="text-blue-600 underline hover:text-blue-700"
            href="/register"
          >
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}
