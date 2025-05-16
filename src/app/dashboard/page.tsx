"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser, getUserWallet } from "@/lib/firestore";
import { FiUser, FiMenu } from "react-icons/fi";
import Player from "lottie-react";
import animationData from "../../../public/animations/panel.json";
import { UserType } from "../types/types";

/**
 * DashboardPage component displays the user's profile information and wallet balance,
 * and a button to access the wallet or admin page, depending on the user's role.
 *
 * This component:
 * - Checks the user's authentication on mount and redirects to login if not authenticated.
 * - Fetches user data and wallet balance on mount.
 * - Displays a loading spinner while data is being fetched.
 * - Shows the user's email and role, and a button to access the wallet or admin page.
 *
 * State:
 * - `user`: The logged-in user.
 * - `balance`: The user's wallet balance.
 * - `userData`: The user's profile information.
 *
 * Side Effects:
 * - Checks the user's authentication on component mount and fetches user data and wallet balance.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      } else {
        setUser(firebaseUser);
        const wallet = await getUserWallet(firebaseUser.uid);
        setBalance(wallet.balance);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        console.log(res);
        
        const transformedUser = {
          uid: res?.uid ?? "",
          role: res?.role ?? "user",
          email: res?.email ?? "",
          createdAt: res?.createdAt ? new Date(res.createdAt) : new Date(),
        };
        setUserData(transformedUser);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg text-center">
        <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-3xl font-semibold text-blue-800 mb-6">
          Painel do Usuário
        </h1>
        {user && (
          <p className="mb-4 text-lg text-gray-700">
            Bem-vindo, <strong>{user.email}</strong>!
          </p>
        )}
        {balance !== null && userData?.role === "user" &&  (
          <>
            <p className="mb-6 text-2xl font-bold text-green-600">
              Saldo da carteira:{" "}
              <span className="text-xl">R$ {balance.toFixed(2)}</span>
            </p>
            <button
              onClick={() => router.push("/dashboard/wallet")}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FiMenu />
              <span>Wallet</span>
            </button>
          </>
        )}
        {userData?.role === "admin" && (
          <>
            <h1 className="text-3xl font-semibold text-blue-800 mb-6">
              Administrador
            </h1>
            <button
              onClick={() => router.push("/dashboard/admin")}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FiUser />
              <span>Admin</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
