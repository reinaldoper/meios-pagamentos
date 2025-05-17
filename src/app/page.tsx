"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
const Player = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../../public/animations/payment.json";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full text-center">
        <div className="w-full max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Bem-vindo à sua carteira digital
        </h1>
        <p className="text-gray-600 mb-6">
          Controle pagamentos, saldos e operações financeiras com praticidade e segurança.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/login">
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-transform hover:scale-105">
              <FaSignInAlt />
              Entrar
            </button>
          </Link>
          <Link href="/register">
            <button className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 px-6 py-2 rounded-full shadow-md transition-transform hover:scale-105">
              <FaUserPlus />
              Criar conta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
