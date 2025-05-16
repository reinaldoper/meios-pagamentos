"use client";

import { useState } from "react";
import { createWallet } from "@/lib/firestore";
import { toast } from "react-toastify";
import Player from "lottie-react";
import animationData from "../../../../public/animations/wallet.json";

export default function CreateWalletPage() {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await createWallet(parseFloat(balance));
      toast.success("Wallet criada com sucesso!");
      setBalance("0");
    } catch (error: Error | unknown) {
      console.error("Erro ao criar wallet:", error);
      toast.error("Erro ao criar wallet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: "200px", width: "200px" }}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Criar Wallet
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Saldo Inicial (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full border text-black border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Criando..." : "Criar Wallet"}
        </button>
      </form>
    </div>
  );
}
