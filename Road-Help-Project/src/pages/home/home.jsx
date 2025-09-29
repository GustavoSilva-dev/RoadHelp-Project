import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./home.module.css"
import maplibregl from "maplibre-gl";
import Mapa from "../../services/Mapa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTruck, faBars, faUser } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const navigate = useNavigate()
    const Search = useRef()
    const mapRef = useRef(null);
    const [sugestoes, setSugestoes] = useState([]);
    const [origem, setOrigem] = useState(null);

    const receberLocalizacao = (posicao) => {
        setOrigem(posicao); 
    };

    useEffect(() => {
        const token = localStorage.getItem("getToken")
        if (!token) {
            navigate("/login")
        } else {
            console.log("Usuário cadastrado")
        }
    }, [])

    useEffect(() => {
        setTimeout(function () {
            document.getElementById("welcome").style.opacity = "0";
            document.getElementById("welcome").style.display = "none";
        }, 4900);
    });

    async function buscarSugestoes(termo) {
        if (!termo) {
            setSugestoes([]);
            return;
        };

        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(termo)}.json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&limit=5`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results) {
                setSugestoes(data.results.map(item => item.address.freeformAddress));
            }
        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
        }
    };

    async function buscarEndereco() {
        const termo = Search.current.value;

        const urlBusca = `https://api.tomtom.com/search/2/search/${encodeURIComponent(termo)}.json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&limit=1`;
        const resposta = await fetch(urlBusca);
        const dados = await resposta.json();

        if (dados.results && dados.results.length > 0 && origem) {
            const destino = dados.results[0].position;

            // marcador no destino
            new maplibregl.Marker({ color: "red" })
                .setLngLat([destino.lon, destino.lat])
                .addTo(mapRef.current);

            // chama rota
            const urlRota = `https://api.tomtom.com/routing/1/calculateRoute/${origem.lat},${origem.lon}:${destino.lat},${destino.lon}/json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&routeType=fastest&travelMode=car`;

            const respostaRota = await fetch(urlRota);
            const dadosRota = await respostaRota.json();

            const coordenadas = dadosRota.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);

            // desenha rota no mapa
            mapRef.current.addLayer({
                id: "rota",
                type: "line",
                source: {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: coordenadas
                        }
                    }
                },
                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },
                paint: {
                    "line-color": "#ff6600",
                    "line-width": 5
                }
            });

            mapRef.current.flyTo({ center: [destino.lon, destino.lat], zoom: 14 });
        } else {
            alert("Endereço não encontrado ou localização atual indisponível.");
        }
    };

    function removeAccount() {
        localStorage.removeItem("getToken");
        localStorage.removeItem('getName');
        localStorage.removeItem('getVName');
        localStorage.removeItem('getVHeight');
        localStorage.removeItem('getVWidth');
        localStorage.removeItem('getVLength');
        navigate('/')
    }

    function showInformations() {
        let vehicleInformations = document.querySelector("#vehicleInformations");

        if (vehicleInformations.style.display == "flex") {
            vehicleInformations.style.display = "none"
        } else {
            vehicleInformations.style.display = "flex"
        }

    }

    function hideMenu() {
        const menu = document.getElementById("menu");

        menu.style.display = "none"
    }

    function showMenu() {
        const menu = document.getElementById("menu");

        menu.style.display = "flex"
    }


    return (
        <div className={styles.patternContainer}>
            <h1 id="welcome" className={styles.welcome}>Olá {localStorage.getItem("getName")}! Você está aqui</h1>

            <button className={styles.showMenu} onClick={showMenu}>
                <FontAwesomeIcon icon={faBars} className={styles.barsIconOutside} />
            </button>

            <div id="menu" className={styles.menu}>
                <button onClick={hideMenu}>
                    <FontAwesomeIcon icon={faBars} className={styles.barsIconInside} />
                </button>

                <div className={styles.UserName}>
                    <FontAwesomeIcon id="userIcon" className={styles.userIcon} icon={faUser} />
                    <p>Olá, {localStorage.getItem("getName")}!</p>
                </div>

                <button className={styles.showVehicle} onClick={showInformations}>Informações do Veículo
                    <FontAwesomeIcon id="setaIcon" icon={faArrowDown} className={styles.setaIcon} />
                </button>

                <div id="vehicleInformations" className={styles.vehicleInformations}>
                    {localStorage.getItem('getVName') ? <h2>{localStorage.getItem('getVName').toUpperCase()}
                        <FontAwesomeIcon icon={faTruck} className={styles.truckIcon} />
                    </h2> : <h2></h2>}
                    <div className={styles.scaleInformation}>
                        <p>• Altura: <span>{localStorage.getItem("getVHeight")} metros</span></p>
                        <p>• Largura: <span>{localStorage.getItem("getVWidth")} metros</span></p>
                        <p>• Comprimento: <span>{localStorage.getItem("getVLength")} metros</span></p>
                    </div>

                </div>

                <button className={styles.remove} onClick={removeAccount}>Sair da sua conta</button>
            </div>

            <div className={styles.searchBar}>
                <input type="text" ref={Search} onChange={(e) => { buscarSugestoes(e.target.value) }} onKeyDown={(e) => {
                    if (e.key === "Enter") { buscarEndereco() }
                }} placeholder="Buscar endereço de destino" />
                <ul className={styles.sugestoes}>
                    {sugestoes.map((sugestao, index) =>
                    (<li key={index} onClick={() => { Search.current.value = sugestao; setSugestoes([]); }}>
                        {sugestao}
                    </li>))}
                </ul>

            </div>
            <Mapa mapRef={mapRef} enviarLocalizacao={receberLocalizacao}/>
        </div>
    )
}

export default Home;