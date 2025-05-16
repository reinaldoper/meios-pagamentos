'use client';

import { useEffect, useState } from 'react';
import { getUserPaymentRequests, updatePaymentRequestStatus } from '@/lib/firestore';
import { PaymentRequest } from '@/app/types/types';
//import { useRouter } from 'next/navigation';

/**
 * AdminRequestsPage component displays a list of payment requests for administrators.
 *
 * This component:
 * - Fetches and displays payment requests from the database.
 * - Allows administrators to approve or reject payment requests.
 * - Shows a loading indicator while the data is being fetched.
 * - Updates the request status in real-time upon action.
 *
 * State:
 * - `requests`: Stores the list of payment requests fetched from Firestore.
 * - `loading`: Indicates if data fetching is in progress.
 *
 * Side Effects:
 * - Fetches payment requests on component mount.
 */

export default function AdminRequestsPage() {

  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  //const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getUserPaymentRequests('admin');
      setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId: string, status: string) => {
    await updatePaymentRequestStatus(requestId, status);
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Solicitações de Pagamento - Administração</h1>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.id} className="border p-4 rounded bg-gray-100">
                <p><strong>Valor:</strong> R$ {req.amount.toFixed(2)}</p>
                <p><strong>Descrição:</strong> {req.description}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${getStatusColor(req.status)}`}>{req.status}</span></p>
                <p className="text-sm text-gray-500">
                  Criado em: {new Date(req.createdAt.seconds * 1000).toLocaleString('pt-BR')}
                </p>

                <div className="mt-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                    onClick={() => handleStatusChange(req.id, 'approved')}
                  >
                    Aprovar
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => handleStatusChange(req.id, 'rejected')}
                  >
                    Rejeitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-yellow-600';
  }
}
