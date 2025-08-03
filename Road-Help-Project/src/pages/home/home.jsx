import { useEffect } from "react";
import { useNavigate } from "react-router";

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
        <div className="pattern-container">
            <h1>Olá {localStorage.getItem("getName")}! Você está logado!</h1>
            <button onClick={removeAccount}>Sair da conta</button>
        </div>
    )
}

export default Home;