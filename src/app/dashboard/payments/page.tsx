"use client";

import React, { useEffect, useState } from "react";
import {
  getUserPaymentRequests,
  getUser,
  updatePaymentRequestStatus,
} from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";
import Player from "lottie-react";
import animationData from "../../../../public/animations/request.json";

function formatDate(timestamp: { seconds: number; nanoseconds: number }) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("pt-BR");
}

export default function PagamentosPage() {
  interface User {
    uid: string;
    role?: string;
  }

  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState<string | null>(null);

  const [pagamentos, setPagamentos] = useState<
    {
      id: string;
      amount: number;
      description: string;
      status: string;
      createdAt: { seconds: number; nanoseconds: number };
    }[]
  >([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        const transformedUser = {
          uid: res?.uid ?? "",
          role: res?.role ?? "user",
          email: res?.email ?? "",
          createdAt: res?.createdAt ? new Date(res.createdAt) : new Date(),
        };
        setUserData(transformedUser);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(userData);
      try {
        if (userData) {
          const res = await getUserPaymentRequests(userData.uid);
          setPagamentos(res);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocorreu um erro.");
      }
    };
    if (userData) {
      fetchUserData();
    }
  }, [userData]);

  const user = auth.currentUser;
  if (!user) {
    redirect("/login");
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <span className="text-gray-500">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updatePaymentRequestStatus(id, status);
      setPagamentos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: "200px", width: "200px" }}
        />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Minhas Solicitações de Pagamento
      </h1>

      {pagamentos.length === 0 ? (
        <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {pagamentos.map((pagamento) => (
            <li key={pagamento.id} className="py-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  💬 {pagamento.description}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-semibold ${
                    pagamento.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : pagamento.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {pagamento.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>💰 R$ {pagamento.amount.toFixed(2)}</span>
                <span>📅 {formatDate(pagamento.createdAt)}</span>
              </div>

              {pagamento.status === "pending" && userData.role === "admin" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(pagamento.id, "approved")}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(pagamento.id, "rejected")}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
