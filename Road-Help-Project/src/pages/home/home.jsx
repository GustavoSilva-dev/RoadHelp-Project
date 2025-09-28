import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./home.module.css"
import Mapa from "../../services/Mapa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTruck, faBars, faUser } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const navigate = useNavigate()
    const Search = useRef()

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

    const mapRef = useRef(null); // cria a referência aqui

    const buscarEndereco = async () => {
        const termo = Search.current.value;

        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(termo)}.json?key=EtPSLvVg3IdQ3FeRlcZcfXOD6xnxjY8Y&limit=1`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results[0])
        console.log(data.results[0].position)

        if (data.results && data.results.length > 0) {
            const { lat, lon } = data.results[0].position;

            if (mapRef.current) {
                mapRef.current.flyTo({
                    center: [lon, lat],
                    zoom: 17
                });
            } else {
                console.log("mapRef ainda está nulo.");
            }
        } else {
            alert("Endereço não encontrado.");
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

let c = 0;
function showInformations() {
    let vehicleInformations = document.querySelector("#vehicleInformations");
    c = c + 1;

    if (c % 2 == 0) {
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
        <h1 id="welcome" className={styles.welcome}>Olá {localStorage.getItem("getName")}! Tenha ótimas viagens!</h1>

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
            <input type="text" ref={Search} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    buscarEndereco()
                }
            }} placeholder="Buscar endereço" />
        </div>
        <Mapa mapRef={mapRef}/>
    </div>
)}

export default Home;