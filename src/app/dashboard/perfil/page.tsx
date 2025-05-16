"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/firestore";
import Player from "lottie-react";
import animationData from "../../../../public/animations/profile.json";
import { UserType } from "@/app/types/types";
import { toast } from "react-toastify";

/**
 * ProfilePage component displays the user's profile information.
 * 
 * This component:
 * - Fetches user data on mount and redirects to login if not authenticated.
 * - Displays a loading spinner while fetching data.
 * - Shows the user's email, role, and registration date.
 * - Allows admin users to manage other users and promote them to admin.
 * 
 * State:
 * - `userData`: Contains the user's profile information.
 * - `error`: Holds any error messages encountered during data fetching or admin promotion.
 * 
 * Side Effects:
 * - Fetches user data and checks authentication on component mount.
 */

export default function ProfilePage() {


  const [userData, setUserData] = useState<UserType>();
  const router = useRouter();

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
        toast.error(error instanceof Error ? error.message : "Ocorreu um erro.");
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

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

  async function handleAdmin(uid: string) {
    try {
      const res = await fetch("/api/set-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      }

      toast.success("Admin criado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao tornar Admin!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-4xl font-semibold text-blue-600 mb-6 text-center">
          Perfil do Usuário
        </h1>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <strong className="text-lg text-gray-700">Email:</strong>
            <p className="text-xl text-blue-700 font-medium">
              {userData?.email}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <strong className="text-lg text-gray-700">Role:</strong>
            <p className="text-xl text-blue-700 font-medium">
              {userData?.role}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <strong className="text-lg text-gray-700">Data de Cadastro:</strong>
            <p className="text-xl text-blue-700 font-medium">
              {userData?.createdAt.toLocaleString()}
            </p>
          </div>
          {userData?.role === "admin" && (
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-2">Gerenciar Usuários</h2>
              <button
                onClick={() => handleAdmin(userData.uid)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Tornar Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
