import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Mapa({ mapRef, enviarLocalizacao }) {
  const markerRef = useRef(null)

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
              zoom: 18
            });
          }

          if (!markerRef.current) {
            markerRef.current = new maplibregl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current);
          } else {
            markerRef.current.setLngLat([longitude, latitude])
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
      style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAVG8zc09NOGFkS2lDVVhGSDv9AEVyK5FBGqZjLdrEMKkr/drafts/0.json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y`,
      center: [-46.6333, -23.5505],
      zoom: 12,
      pitch: 60
    });

    mapRef.current = map;
  }, []);



  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}



