"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentRequest } from "@/lib/firestore";
import { SendHorizonal, FileText, DollarSign } from "lucide-react";

export default function NovaSolicitacaoPage() {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPaymentRequest(amount, description);
      router.push("/dashboard/payments");
    } catch (error: Error | unknown) {
      alert(error ? error : "Ocorreu um erro ao criar a solicitação.");
      return;
    }
  };

  const disabled = !amount || !description;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-700" size={32} />
        <h1 className="text-3xl font-bold text-blue-700">
          Nova Solicitação de Pagamento
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Descrição
          </label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Ex: Reembolso de despesas"
            />
            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Valor (R$)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0.01"
              step="0.1"
              required
              className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Ex: 150.00"
            />
            <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <button
          disabled={disabled}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          <SendHorizonal size={20} />
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
}
