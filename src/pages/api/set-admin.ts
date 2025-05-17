import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin/app";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};



if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
    throw error;
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório." });
  }

  try {
    await getAuth().setCustomUserClaims(uid, { role: "admin" });
    return res.status(200).json({ message: `Usuário ${uid} agora é admin.` });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro ao definir role de admin.", err });
  }
}
