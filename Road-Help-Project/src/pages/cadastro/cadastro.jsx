import styles from "./cadastro.module.css";
import api from "../../services/api"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

function Cadastro() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputVName = useRef();
  const inputVHeight = useRef();
  const inputVWidth = useRef();
  const inputVLength = useRef();

  async function getUsers() {
    const usersFromApi = await api.get('/users');

    setUsers(usersFromApi.data);
  }
  
  async function enterUser() {
    await createUsers();
    
    const verificador = await api.post('/login', {
      email: inputEmail.current.value,
      password: inputPassword.current.value
    });

    if(!verificador.data.exists || !verificador.data.existsP){
      console.log("Erro de Entrada Encontrado, tente novamente");
      return;
    };

  // GUARDANDO INFORMAÇÕES DO USUÁRIO COM LOCALSTORAGE
    let token = verificador.data.token
    let name = verificador.data.name
    let nameV = verificador.data.v_name
    let hgt = verificador.data.v_height
    let wdt = verificador.data.v_width
    let lgt = verificador.data.v_length

    localStorage.setItem('getToken', token)
    localStorage.setItem('getName', name)
    localStorage.setItem('getVName', nameV)
    localStorage.setItem('getVHeight', hgt)
    localStorage.setItem('getVWidth', wdt)
    localStorage.setItem('getVLength', lgt)
    navigate('/home')
  }

  async function createUsers() {
    await api.post('/users', {
      email: inputEmail.current.value,
      name: inputName.current.value,
      password: inputPassword.current.value,
      v_name: inputVName.current.value,
      v_height: Number(inputVHeight.current.value),
      v_width: Number(inputVWidth.current.value),
      v_length: Number(inputVLength.current.value)
    })
    return;
  }

  function verifyFunctions() {
    const errorSquare = document.getElementById("errorSquare");
    const etapa1 = document.getElementById('etapa-1');
    const etapa2 = document.getElementById('etapa-2');
    const tituloMessage2 = document.getElementById("tituloMessage02");
    const hideError = document.getElementById("hideError");
    const inputs = document.querySelectorAll("input");

    errorSquare.style.display = "none";
    tituloMessage2.style.display = "none";
    etapa2.style.display = "none";

    hideError.addEventListener("click", function () {
      errorSquare.style.display = "none";
    });

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        this.value = this.value.replace(/\s/g, "");
      });
    });
  }

  function verifyEtapa1() {
    const errorSquare = document.getElementById("errorSquare");
    const etapa2 = document.getElementById('etapa-2');
    const tituloMessage2 = document.getElementById("tituloMessage02");
    const etapa1 = document.getElementById('etapa-1');
    const tituloMessage1 = document.getElementById("tituloMessage01");
    const errorMessage = document.getElementById("errorMessage");

    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();
    let confirm = document.getElementById("senha2").value.trim();

    if (nome === "" || email === "" || senha === "" || confirm === "") {

      console.log("ERRO 001");
      errorSquare.style.display = "flex";

      errorMessage.innerHTML = "Preencha todas as informações corretamente!";
      return;

    } else if (!email.endsWith("@gmail.com")) {

      console.log("ERRO 002");
      errorSquare.style.display = "flex";

      errorMessage.innerHTML =
        "Preencha o email corretamente! Finalizando com @gmail.com";
      return;

    } else if (confirm != senha) {

      console.log("ERRO 003");
      errorSquare.style.display = "flex";

      errorMessage.innerHTML =
        "A senha e sua confirmação não batem, digite corretamente";
      return;

    }

    tituloMessage1.style.display = "none";
    tituloMessage2.style.display = "flex";
    etapa1.style.display = "none";
    etapa2.style.display = "flex";
  }

  function verifyEtapa2() {
    const errorSquare = document.getElementById("errorSquare");
    const veiculo = document.getElementById("veiculo").value.trim();
    const height = document.getElementById("height").value.trim();
    const width = document.getElementById("width").value.trim();
    const length = document.getElementById("length").value.trim();

    if (veiculo == "" || height == "" || width == "" || length == "") {
      errorSquare.style.display = "flex";

      errorMessage.innerHTML = "Preencha todas as informações corretamente!"
      return;
    } else if (height > 8 || height <= 0) {
      errorSquare.style.display = "flex";

      errorMessage.innerHTML = "A altura do veículo está incorreta, digite um valor válido";
      return;
    } else if (width > 9 || width <= 0) {
      errorSquare.style.display = "flex";

      errorMessage.innerHTML = "A largura do veículo está incorreta, digite um valor válido";
      return;
    } else if (length > 20 || length <= 0) {
      errorSquare.style.display = "flex";

      errorMessage.innerHTML = "O comprimento do veículo está incorreto, digite um valor válido";
      return;
    }

    
    enterUser()
    return
  }

  useEffect(() => {
    verifyFunctions();
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles.containerMain}>
      <div className={styles.titulo}>
        <h1>CADASTRO</h1>
        <p id="tituloMessage01">Cadastre-se no Road Help!</p>
        <p id="tituloMessage02">Você está quase lá! Informe seu veículo!</p>
      </div>

      <div id="errorSquare" className={styles.errorSquare}>
        <h1>ERRO!</h1>
        <p id="errorMessage">Preencha todas as informações corretamente!</p>
        <button id="hideError">OK</button>
      </div>

      <div className={styles.container}>
        <form id="cadastroForm" className={styles.cadastroForm}>

          <div id="etapa-1" className={styles.etapa1}>
            <label className={styles.label}>Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome..."
              ref={inputName}
            />

            <label className={styles.label}>Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Digite seu email..."
              ref={inputEmail}
            />

            <label className={styles.label}>Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha..."
              ref={inputPassword}
            />

            <label type="text" className={styles.label}>Confirme a Senha</label>
            <input
              type="password"
              id="senha2"
              name="senha2"
              placeholder="Digite novamente..."
            />

            <button type="button" id="avancarEtapa" className={styles.avancarEtapa} onClick={verifyEtapa1}>Continuar</button>
          </div>

          <div id="etapa-2" className={styles.etapa2}>
            <label className={styles.label}>Nome do Veículo</label>
            <input
              type="text"
              id="veiculo"
              name="veiculo"
              placeholder="Digite o nome do veículo..."
              ref={inputVName}
            />


            <label className={styles.label}>Altura do Veículo</label>
            <input
              type="number"
              id="height"
              name="height"
              min="0"
              placeholder="Digite a altura (em metros)..."
              ref={inputVHeight}
            />

            <label className={styles.label}>Largura do Veículo</label>
            <input
              type="number"
              id="width"
              name="width"
              min="0"
              placeholder="Digite a largura (em metros)..."
              ref={inputVWidth}
            />

            <label className={styles.label}>Comprimento do Veículo</label>
            <input
              type="number"
              id="length"
              name="length"
              min="0"
              placeholder="Digite o comprimento (em metros)..."
              ref={inputVLength}
            />

            <button type="button" onClick={verifyEtapa2}>Confirmar</button>
          </div>

        </form>

        <p>Já possui uma conta?</p>
        <a className={styles.link} href="/login">
          Entre aqui
        </a>
        <br className={styles.br} />
        <br className={styles.br} />
      </div>
    </div>
  );
}

export default Cadastro;
