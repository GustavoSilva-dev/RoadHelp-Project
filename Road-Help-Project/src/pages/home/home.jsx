import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./home.module.css";
import "./adicionais.css";
import maplibregl from "maplibre-gl";
import Mapa from "../../services/Mapa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTruck, faTruckFast, faBars, faUser, faSearch, faPaperPlane, faClock } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const navigate = useNavigate()
    const Search = useRef()
    const mapRef = useRef(null);
    const [sugestoes, setSugestoes] = useState([]);
    const [origem, setOrigem] = useState(null);
    const [parametros, setParametros] = useState(null);
    const [rotaCalculada, setRotaCalculada] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false); 
    const [isVisible, setIsVisible] = useState(false);  
    const [animateClass, setAnimateClass] = useState("");

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

    useEffect(() => {
        if (searchVisible) {
            setAnimateClass("showSearchBar");
        } else {
            setAnimateClass("hideSearchBar");
        }
    }, [searchVisible]);

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

    const destinationMarker = useRef(null);
    async function buscarEndereco() {
        const termo = Search.current.value;
        const map = mapRef.current
        const urlBusca = `https://api.tomtom.com/search/2/search/${encodeURIComponent(termo)}.json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&limit=1`;
        const resposta = await fetch(urlBusca);
        const dados = await resposta.json();
        const destino = dados.results[0].position;

        const altura = Number(localStorage.getItem('getVHeight')) || 0;
        const largura = Number(localStorage.getItem('getVWidth')) || 0;
        const comprimento = Number(localStorage.getItem('getVLength')) || 0;
        const pesoPadrao = 15000;

        const urlRota = `https://api.tomtom.com/routing/1/calculateRoute/${origem.lat},${origem.lon}:${destino.lat},${destino.lon}/json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&travelMode=truck&routeType=fastest&vehicleHeight=${altura}&vehicleWidth=${largura}&vehicleLength=${comprimento}&departAt=now&traffic=true&vehicleWeight=${pesoPadrao}&vehicleCommercial=true`;
        const respostaRota = await fetch(urlRota);
        const dadosRota = await respostaRota.json();

        const urlRotaPerigosa = `https://api.tomtom.com/routing/1/calculateRoute/${origem.lat},${origem.lon}:${destino.lat},${destino.lon}/json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&travelMode=car&routeType=fastest`;
        const responsePerigosa = await fetch(urlRotaPerigosa);
        const dadosRotaPerigosa = await responsePerigosa.json();

        var marcador = document.createElement('div');
        marcador.className = 'marker-destino';

        if (!destinationMarker.current) {
            destinationMarker.current = new maplibregl.Marker({ element: marcador })
                .setLngLat([destino.lon, destino.lat])
                .addTo(mapRef.current);
        } else {
            destinationMarker.current.setLngLat([destino.lon, destino.lat])
        }

        if (dadosRotaPerigosa.routes && dadosRotaPerigosa.routes.length > 0) {
            const pontosPerigosos = dadosRotaPerigosa.routes[0].legs[0].points;
            const coordenadasPerigosas = pontosPerigosos.map(p => [p.longitude, p.latitude]);

            const geoJSONPerigosa = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordenadasPerigosas
                }
            };

            if (map.getLayer('rota-perigosa')) {
                map.removeLayer('rota-perigosa');
            }

            if (map.getSource('rota-perigosa')) {
                map.removeSource('rota-perigosa');
            }

            map.addSource('rota-perigosa', {
                type: 'geojson',
                data: geoJSONPerigosa
            });

            map.addLayer({
                id: 'rota-perigosa',
                type: 'line',
                source: 'rota-perigosa',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 5,
                    'line-opacity': 0.7
                }
            });
        }

        if (dadosRota.routes && dadosRota.routes.length > 0) {
            const rotaPrincipal = dadosRota.routes[0];
            const coordenadas = rotaPrincipal.legs[0].points.map(p => [p.longitude, p.latitude]);

            const bounds = coordenadas.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new maplibregl.LngLatBounds(coordenadas[0], coordenadas[0]));

            map.fitBounds(bounds, {
                padding: 100,
                duration: 1500,
                pitch: 0
            });

            if (map.getLayer('rota')) { map.removeLayer('rota'); }
            if (map.getSource('rota')) { map.removeSource('rota'); }

            map.addSource('rota', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: coordenadas }
                }
            });

            map.addLayer({
                id: 'rota',
                type: 'line',
                source: 'rota',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#2f67ffff', 'line-width': 6 }
            });

            const parametros = rotaPrincipal.summary;
            setParametros(parametros);
            setRotaCalculada(true);
        } else {
            alert("Não foi possível encontrar uma rota para este destino. Verifique se o endereço é válido ou se as dimensões do seu caminhão (altura/largura) não estão bloqueando o acesso.");
        }

        setSugestoes([]);
    };

    const iniciarRota = () => {
        if (origem && origem.lat && origem.lon) {
            inicializarRotaFunction(origem);
        } else {
            alert("Localização do motorista não obtida.")
        }
    };

    const inicializarRotaFunction = (localizacaoAtual) => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (map.getLayer('rota-perigosa')) {
            map.removeLayer('rota-perigosa');
        }
        
        if (map.getSource('rota-perigosa')) {
            map.removeSource('rota-perigosa');
        }

        map.flyTo({
            center: [localizacaoAtual.lon, localizacaoAtual.lat],
            zoom: 18,
            pitch: 60, 
            duration: 2500
        });

        setParametros(false);
        setRotaCalculada(false);
    }

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

    function formatarTempo(parametros) {
        const horas = Math.floor(parametros / 3600)
        const minutos = Math.floor((parametros % 3600) / 60)

        return horas + "h" + minutos + "m";
    }

    function toggleSearchBar() {
        setSearchVisible(!searchVisible);
        const pesquisa = document.getElementById("searchBar");

        if (searchVisible) {
            setTimeout(() => {
                pesquisa.style.display = "none";
            }, "320")
        } else {
            pesquisa.style.display = "flex";
        }
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

                <button className={styles.showVehicle} id="showVehicle" onClick={showInformations}>Informações do Veículo
                    <FontAwesomeIcon id="setaIcon" icon={faArrowDown} className={styles.setaIcon} />
                </button>

                <div id="vehicleInformations" className={styles.vehicleInformations}>
                    {
                        localStorage.getItem('getVName') ? <h2>{localStorage.getItem('getVName').toUpperCase()}
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

            <button className={styles.showSearch} onClick={toggleSearchBar}>
                <FontAwesomeIcon icon={faSearch} />
            </button>

            <div className="searchContainer">
                <input
                    className={`searchBar ${animateClass}`}
                    id="searchBar"
                    type="text"
                    ref={Search}
                    onChange={(e) => buscarSugestoes(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") buscarEndereco(); }}
                    placeholder="Buscar endereço de destino"
                />
                <ul className={`sugestoes ${animateClass === "showSearchBar" ? "showSugestoes" : "hideSugestoes"}`}>
                    {sugestoes.map((sugestao, index) => (
                        <li
                            key={index}
                            onClick={() => { Search.current.value = sugestao; setSugestoes([]); }}
                        >
                            {sugestao}
                        </li>
                    ))}
                </ul>

                <button className={`envButton ${animateClass === "showSearchBar" ? "showEnvbutton" : "hideEnvbutton"}`} onClick={buscarEndereco}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>

            {parametros &&
                (<div id="infoRota" className={styles.infoRota}>
                    <h2>Distância da Rota: <span><FontAwesomeIcon icon={faTruckFast} className={styles.truckFastIcon} /> {(parametros.lengthInMeters / 1000).toFixed(1)}km</span></h2>
                    <h2>Tempo da Rota: <span><FontAwesomeIcon icon={faClock} className={styles.clockIcon} /> {formatarTempo(parametros.travelTimeInSeconds)}</span></h2>
                </div>)
            }

            {rotaCalculada &&
                (<button id="iniciarRota" className={styles.iniciarRota} onClick={iniciarRota}>INICIAR ROTA</button>)
            }

            <Mapa mapRef={mapRef} enviarLocalizacao={receberLocalizacao} />
        </div>
    )
}

export default Home;