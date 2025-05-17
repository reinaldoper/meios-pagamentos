

import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * DashboardLayout is a Next.js layout component that wraps the dashboard pages.
 * It provides a shared navigation bar and ensures that the user is authenticated
 * before rendering the page.
 *
 * If the user is not authenticated, it redirects them to the login page.
 *
 * The navigation bar includes links to the home page, payments page, profile page,
 * and the new payment request page.
 *
 * The navigation bar also includes a logout button.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 flex flex-wrap justify-between items-center">
        <div className="flex gap-4">
          <Link href="/dashboard">🏠 Início</Link>
          <Link href="/dashboard/payments">💳 Pagamentos</Link>
          <Link href="/dashboard/perfil">👤 Perfil</Link>
          <Link href="/dashboard/payments/new">➕ Nova Solicitação</Link>
        </div>
        <form action="/logout" method="post">
          <button className="bg-red-500 px-4 py-1 rounded">Sair</button>
        </form>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
