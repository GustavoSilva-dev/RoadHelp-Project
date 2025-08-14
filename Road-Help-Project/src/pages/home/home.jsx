import { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./home.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

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

    return (
        <div className={styles.patternContainer}>
            <h1 id="welcome" className={styles.welcome}>Olá {localStorage.getItem("getName")}! Tenha ótimas viagens!</h1>

            <div className={styles.map}>
                *mapa
            </div>

            <div className={styles.menu}>
                <button className={styles.showVehicle}>Informações do Veículo 
                <FontAwesomeIcon icon={faArrowDown} className={styles.setaIcon}/>
                </button>
                
                <button className={styles.remove} onClick={removeAccount}>Sair da conta</button>
            </div>

           
            <div className={styles.content}>
            </div>

        </div>
    )
}

export default Home;