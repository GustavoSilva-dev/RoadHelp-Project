import styles from "./login.module.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api"
import { redirect } from "react-router";


function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("getToken")

    if(token) {
      navigate("/home")
    }
  }, [])

  const inputLoginEmail = useRef()
  const inputLoginPassword = useRef()

  async function verifyLogin(event) {
    event.preventDefault()

    const errorLoginSquare = document.getElementById("errorLoginSquare");
    const hideLoginError = document.getElementById("hideLoginError");
    const errorLoginMessage = document.getElementById("errorLoginMessage");
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("senha").value.trim();

    // ETAPA 1 
    if (email == "" || password == "") {
      errorLoginSquare.style.display = "flex"
      return;
    }
    else if (!email.endsWith("@gmail.com")) {
      errorLoginSquare.style.display = "flex"

      errorLoginMessage.innerHTML = "Digite o email corretamente, finalizando com @gmail.com"
      return;
    }

    // ETAPA 2
    const verificador = await api.post('/login', {
      email: inputLoginEmail.current.value,
      password: inputLoginPassword.current.value
    })

    if (!verificador.data.exists) {
      errorLoginSquare.style.display = "flex"

      errorLoginMessage.innerHTML = "Email não existente, escreva corretamente"
      return
    }

    if (!verificador.data.existsP) {
      errorLoginSquare.style.display = "flex"

      errorLoginMessage.innerHTML = "Senha incorreta, tente novamente"
      return
    }

    // GUARDANDO INFORMAÇÕES DO USUÁRIO COM LOCALSTORAGE
    let token = verificador.data.token
    let name = verificador.data.name
    let nameV = verificador.data.v_name
    let height = verificador.data.v_height
    let width = verificador.data.v_width
    let length = verificador.data.v_length

    localStorage.setItem('getToken', token)
    localStorage.setItem('getName', name)
    localStorage.setItem('getVName', nameV)
    localStorage.setItem('getVHeight', height)
    localStorage.setItem('getVWidth', width)
    localStorage.setItem('getVLength', length)
    navigate('/home')
  }

  function verifyFunctions() {
    const errorLoginSquare = document.getElementById("errorLoginSquare");
    const hideLoginError = document.getElementById("hideLoginError");
    const inputs = document.querySelectorAll("input");

    errorLoginSquare.style.display = "none";

    hideLoginError.addEventListener("click", function () {
      errorLoginSquare.style.display = "none"
    })

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        input.value = input.value.replace(/\s/g, "")
      })
    })

  }

  useEffect(() => {
    verifyFunctions()
  }, [])

  return (
    <div className={styles.containerMain}>
      <div className={styles.titulo}>
        <h1>ENTRAR</h1>
        <p>Logue com sua conta no Road Help!</p>
      </div>

      <div id="errorLoginSquare" className={styles.errorLoginSquare}>
        <h1>ERRO DE LOGIN!</h1>
        <p id="errorLoginMessage">Insira as informações corretamente</p>
        <button id="hideLoginError">OK</button>
      </div>

      <div className={styles.container}>
        <form className={styles.loginForm} action="" method="post" onSubmit={verifyLogin}>
          <label>Email</label>
          <br />
          <input className={styles.input}
            type="text"
            id="email"
            name="email"
            placeholder="Digite seu email"
            ref={inputLoginEmail}
          />

          <label>Senha</label>
          <br />
          <input className={styles.input}
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            ref={inputLoginPassword}
          />

          <input className={styles.input} type="submit" value="Entrar" />
        </form>

        <p>Não possui uma conta?</p>
        <a className={styles.link} href="./cadastro">Crie uma aqui</a>
      </div>
    </div>
  );
}

export default Login;