import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { latitude, longitude } = req.body;

  try {
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
    );
    return res.status(200).json({ message: response.data });
  } catch (error: Error | unknown) {
    return res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Ocorreu um erro.",
      });
  }
}
