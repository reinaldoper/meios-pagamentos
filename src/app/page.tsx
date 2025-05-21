"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
const Player = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../../public/animations/payment.json";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { ClimaTempo } from "./types/types";
import animationDataClima from "../../public/animations/clima.json";
import animationDataLoading from "../../public/animations/loading.json";

export default function HomePage() {
  const [dadosClima, setDadosClima] = useState<ClimaTempo[]>([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [location, setLocation] = useState({
      city: "",
  });

  const [erro, setErro] = useState(false);

  useEffect(() => {
    function obterLocalizacao() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (posicao) => {
            setCoords({
              latitude: posicao.coords.latitude,
              longitude: posicao.coords.longitude,
            });
          },
          (erro) => {
            console.error("Erro ao obter localização:", erro);
            toast.error("Erro ao obter localização.");
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
        toast.error("Geolocalização não é suportada neste navegador.");
      }
    }

    obterLocalizacao();
  }, []);

  useEffect(() => {
    async function buscarDadosClimaticos() {
      try {
        console.log(coords);
        if (!loading) {
          const resposta = await fetch("/api/clima-tempo", {
            method: "POST",
            body: JSON.stringify(coords),
          });
          const dados = await resposta.json();
          if (!resposta.ok) {
            toast.error("Erro ao buscar dados climáticos.");
          }
          setDadosClima(dados.message);
        }
      } catch (erro: Error | unknown) {
        console.error("Erro ao buscar clima:", erro);
        toast.error(erro instanceof Error ? erro.message : "Ocorreu um erro.");
      } finally {
        setLoading(false);
      }
    }
    buscarDadosClimaticos();
  }, [coords, loading]);

  useEffect(() => {
    const getLocation = async () => {
      
        const URL = `/api/location`;
        const resposta = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dados = await resposta.json();
        console.log(dados);

        if (!resposta.ok) {
          toast.error("Erro ao buscar localização.");
        } else {
          setLocation(dados.message);
          setErro(true);
        }
    };
    getLocation();
  }, [coords, loading]);

  const convertKelvinToCelsius = (kelvin: number) => {
    return kelvin - 273.15;
  };

  const climaAtual = () => {
    const dataAtual = dadosClima.length - 1;
    return dadosClima[dataAtual];
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full text-center">
        <ul>
          {dadosClima.length > 0 ? (
            <span className="w-full max-w-xs mx-auto">
              <Player
                autoplay
                loop
                animationData={animationDataClima}
                style={{ height: "100px", width: "100px" }}
              />
              <span className="text-lime-300">Temperatura:</span>{" "}
              {convertKelvinToCelsius(climaAtual().temp).toFixed(2)}°C
            </span>
          ) : (
            <strong className="text-gray-900 w-full max-w-xs mx-auto">
              <Player
                autoplay
                loop
                animationData={animationDataLoading}
                style={{ height: "100px", width: "100px" }}
              />
              Carregando dados climáticos...
            </strong>
          )}
          {erro && (
            <span className="w-full max-w-xs mx-auto">
              <br />
              <span className="text-lime-300">Localização:</span>{" "}
              {location.city}
              <br />
            </span>
          )}
        </ul>
        <div className="w-full max-w-xs mx-auto mb-6">
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Bem-vindo à sua carteira digital
        </h1>
        <p className="text-gray-600 mb-6">
          Controle pagamentos, saldos e operações financeiras com praticidade e
          segurança.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/login">
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-transform hover:scale-105">
              <FaSignInAlt />
              Entrar
            </button>
          </Link>
          <Link href="/register">
            <button className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 px-6 py-2 rounded-full shadow-md transition-transform hover:scale-105">
              <FaUserPlus />
              Criar conta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
