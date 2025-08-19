import { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./home.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTruck, faBars } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const navigate = useNavigate()

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

        <div className={styles.map}>
            *mapa
        </div>

        <button className={styles.showMenu} onClick={showMenu}>
            <FontAwesomeIcon icon={faBars} className={styles.barsIconOutside} />
        </button>

        <div id="menu" className={styles.menu}>
            <button onClick={hideMenu}>
                <FontAwesomeIcon icon={faBars} className={styles.barsIconInside} />
            </button>

            <button className={styles.showVehicle} onClick={showInformations}>Informações do Veículo
                <FontAwesomeIcon id="setaIcon" icon={faArrowDown} className={styles.setaIcon} />
            </button>

            <div id="vehicleInformations" className={styles.vehicleInformations}>
                <h2>{localStorage.getItem('getVName').toUpperCase()}
                    <FontAwesomeIcon icon={faTruck} className={styles.truckIcon} />
                </h2>

                <div className={styles.scaleInformation}>
                    <p>• Altura: <span>{localStorage.getItem("getVHeight")} metros</span></p>
                    <p>• Largura: <span>{localStorage.getItem("getVWidth")} metros</span></p>
                    <p>• Comprimento: <span>{localStorage.getItem("getVLength")} metros</span></p>
                </div>

            </div>

            <button className={styles.remove} onClick={removeAccount}>Sair da conta</button>
        </div>


        <div className={styles.content}>
        </div>

    </div>
)}

export default Home;