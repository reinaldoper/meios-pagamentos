
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Meios de Pagamento",
  description: "Aplicação para gerenciar pagamentos e carteira digital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="w-full h-full m-0 p-0">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
