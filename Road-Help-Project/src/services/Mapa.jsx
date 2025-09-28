import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Mapa({ mapRef }) {
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



