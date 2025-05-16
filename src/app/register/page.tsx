'use client';

import { useState } from 'react';
import { register } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Player from "lottie-react";
import animationData from "../../../public/animations/register.json";
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      document.cookie = `__session=true; path=/`; 
      toast.success('Sucesso ao criar conta!');
      router.push('/dashboard');
    } catch (err: Error | unknown) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-200">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4 transform transition-all hover:scale-105">
        <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">Criar Conta</h1>

        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
            className="w-full p-4 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none"
        >
          Criar Conta
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Já tem uma conta?{' '}
          <a className="text-green-600 underline hover:text-green-700" href="/login">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}
