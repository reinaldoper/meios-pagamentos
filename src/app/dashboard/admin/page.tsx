"use client";

import { useEffect, useState } from "react";
import { getAllWallets, getUserWalletBalance } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { UserType, Wallet } from "@/app/types/types";
import Player from "lottie-react";
import animationData from "../../../../public/animations/amount.json";

/**
 * Component for displaying the admin page where all user wallets and their balances are listed.
 *
 * This component:
 * - Checks if the current user is an admin and redirects non-admin users to the dashboard.
 * - Fetches all wallets and user data if the user is an admin.
 * - Displays a loading spinner while data is being fetched.
 * - Shows a list of user emails and their corresponding wallet balances.
 *
 * State:
 * - `wallets`: Stores the list of wallets fetched from Firestore.
 * - `isAdmin`: Determines if the current user is an admin.
 * - `loading`: Indicates if data fetching is in progress.
 * - `userDataMap`: Maps user IDs to their respective user data.
 *
 * Side Effects:
 * - Checks the user's admin status and fetches data on component mount.
 */

export default function WalletsAdminPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDataMap, setUserDataMap] = useState<{ [uid: string]: UserType }>(
    {}
  );

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      const user = auth.currentUser;
      if (!user) return redirect("/dashboard");

      const token = await user.getIdTokenResult();
      if (token.claims.role === "admin") {
        setIsAdmin(true);
        const result = await getAllWallets();
        setWallets(result);

        const userMap: { [uid: string]: UserType } = {};
        for (const wallet of result) {
          if (wallet.uid) {
            const userData = await getUserWalletBalance(wallet.uid);
            userMap[wallet.uid] = {
              ...userData,
              createdAt: userData.createdAt ?? new Date(0),
            };
          }
        }
        setUserDataMap(userMap);
      } else {
        redirect("/dashboard");
      }

      setLoading(false);
    };

    checkAdminAndLoad();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <span className="text-gray-500">Carregando...</span>
        </div>
      </div>
    );
  }

  /*const handleWalletClick = async (uid: string, balance: number) => {
    await updateWalletBalance(uid, balance);
    const updatedWallets = wallets.map((wallet) => {
      if (wallet.uid === uid) {
        return {
          ...wallet,
          balance: 0,
        };
      }
      return wallet;
    });
    setWallets(updatedWallets);
  };*/

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      {isAdmin && (
        <>
          <div className="w-full justify-center items-center max-w-xs mx-auto mb-6">
            <Player
              autoplay
              loop
              animationData={animationData}
              style={{ height: "200px", width: "200px" }}
            />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-blue-800">
            Saldos dos Usuários
          </h1>
          <ul className="divide-y divide-gray-200">
            {wallets.map((wallet) => {
              const userInfo = wallet.uid ? userDataMap[wallet.uid] : undefined;
              return (
                <li
                  key={wallet.uid ?? Math.random()}
                  className="py-2 flex justify-between"
                >
                  <span className="text-gray-700">
                    👤 Email: {userInfo ? userInfo.email : "Carregando..."}
                  </span>
                  <span className="text-green-600 font-semibold">
                    💰 R$ {wallet.balance.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
