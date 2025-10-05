import { useState, useEffect } from 'react'
import roadLogo from '../../assets/Road Help Logo.png'
import './style.css'

function Inicial() {
  function animacaoJS() {
    setTimeout(function () {
      if (document.getElementById('ultimobotao')) {
        document.getElementById('ultimobotao').style.opacity = "1";
      }
    }, 900)
  }

  useEffect(() => {
    animacaoJS()
  }, []);

  useEffect(() => {
    function fraseAnimation() {
      setInterval
    }
  })

  return (
    <main id="tela-de-entrada">

      <img src={roadLogo} alt="Logotipo da Road Help" />

      <div className="texto-entrada">
        <div className="textos">
          <h2>
            <i>"Grandes cargas, grandes rotas”</i>
          </h2>
          <h1>CADASTRE-SE</h1>
        </div>

        <div className="botoes-de-entrada">
          <a href="./login">
            <button className="button">Entrar</button>
          </a>

          <a href="./cadastro">
            <button className="button" id="ultimobotao">Criar uma conta</button>
          </a>
        </div>
      </div>
    </main>
  )
}

export default Inicial
