import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Mapa({ mapRef, enviarLocalizacao }) {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (posicao) => {
          const { latitude, longitude } = posicao.coords;
          enviarLocalizacao({
            lat: latitude,
            lon: longitude
          });

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 17
            });

            new maplibregl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current);
          }
        },
        (erro) => {
          console.error("Erro ao obter localização:", erro);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000
        }
      );
    } else {
      alert("Geolocalização não é suportada neste navegador.");
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) return;
    maplibregl.setWorkerCount(6);

    const map = new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        sources: {
          tomtom: {
            type: "raster",
            tiles: [
              `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y`
            ],
            tileSize: 256,
            attribution: '© <a href="https://www.tomtom.com/">TomTom</a>'
          }
        },
        layers: [
          {
            id: "tomtom",
            type: "raster",
            source: "tomtom"
          }
        ]
      },
      center: [-46.6333, -23.5505],
      zoom: 12
    });

    mapRef.current = map;
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}



