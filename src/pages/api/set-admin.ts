import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import serviceAccount from "../../../serviceAccountKey.json";
import type { ServiceAccount } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
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
