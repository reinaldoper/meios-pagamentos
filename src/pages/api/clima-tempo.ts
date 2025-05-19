import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_KEY = process.env.CLIMA_TEMPO_API_KEY;
const BASE_URL = "https://gribstream.com/api/v2/gfs/history";
const START_DATE = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(); 
const END_DATE = new Date(Date.now()).toISOString();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }
  try {
    const { latitude, longitude } = req.body;
    const response = await axios.post(
      BASE_URL,
      {
        fromTime: START_DATE,
        untilTime: END_DATE,
        coordinates: [
          {
            lat: latitude,
            lon: longitude,
            name: "Tolocale",
          },
        ],
        variables: [
          {
            name: "TMP",
            level: "2 m above ground",
            alias: "temp",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ message: response.data });
  } catch (error: Error | unknown) {
    console.error("Erro ao buscar dados do clima:", error instanceof Error ? error.message : error);
    return res.status(error instanceof Error ? error.stack?.includes("429") ? 429 : 500 : 500).json({
      error: "Erro ao buscar dados do clima",
      details: error instanceof Error ? error.message : error,
    });
  }
}
