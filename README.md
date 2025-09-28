# 🚀 Projeto Road Help

Projeto focado na criação de um GPS funcional e interativo, destinado para veículos e caminhões de carga. Ele possuirá sistemas de cadastramento e login, verificação automatizada de rodovias e veículos e algoritmo especializado na criação de rotas

---

## 📚 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar](#como-executar)
- [Como Atualizar o Repositório](#como-atualizar)
- [Integrantes](#integrantes)
- [Licença](#licença)

---

## 🧠 Sobre o Projeto

> Este projeto foi desenovlvido como parte de um trabalho em grupo focado na FeCEAP, uma feira de tecnologia regional do bairro de Pedreira, do CEAP (Centro Educacional Assistencial Profissionalizante). O objetivo é criar um site/plataforma focado no auxílio ao tráfego urbano de transportes de carga, sendo um GPS automatizado e responsivo para usuários de determinados veículos. Nele, será possivel a elaboração de rotas automatizadas para cada tipo de veículo, avaliando sua altura, largura e comprimento, verificando lugares na qual o veículo pode trafegar ou não.

---

## 🛠️ Tecnologias Utilizadas

- [x] HTML5 / CSS3 / JavaScript
- [x] React
- [x] Node.js / Express
- [x] MongoDB / Prisma Client
- [x] Git / GitHub
- [x] MapLibre GL JS / TomTom API

---

## ▶️ Como Executar

Passo a passo para rodar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/GustavoSilva-dev/RoadHelp-Project

# Acesse a pasta do projeto
cd RoadHelp-Project

# Abra um terminal para o Back-End
cd "Projeto FeCEAP - Server"

# Instale as dependências
npm install

# Instale as dependências do Prisma Client
npx prisma generate

# Insira as mudanças no .env

# Dê permissão ao seu IP no MongoDB

# Verifique os IPs contidos no api.js (Front-End) e no server.js (Back-End)

# Inicialize o Back-End
node --watch server.js

# Abra outro terminal para o Front-End
cd Road-Help-Project

# Instale as dependências
npm install

# Inicialize o Front-End
npm run dev

```
## 🔄 Como Atualizar o Repositório

Como atualizar o projeto diretamente no repositório

``` bash
# 1. Verifique os arquivos modificados
git status

# 2. Adicione os arquivos alterados ao stage
git add nome-do-arquivo
# ou para adicionar tudo:
git add .

# 3. Insira suas informações de usuário
git config --global user.name "Seu nome"

# 3.5 Insira suas informações de email
git config --global user.email "seuemaildogithub@gmail.com"

# 3. Faça o commit das alterações
git commit -m "Descreva aqui o que foi alterado"

# 4. Envie para o repositório remoto
git push origin master

```
AVISO - Não se esqueça de salvar todos os seus arquivos (Ctrl S) antes de atualizar o repositório

---

## 🔄 Como Atualizar os Seus Arquivos

Como atualizar o seu projeto localmente, depois de ter ocorrido alterações no repositório

``` bash
# 1. Verifique se houve mudanças locais, pois pode ocorrer erro, e desfaça essas mudanças
git reset --hard
# ou, se precisa manter as mudanças, mantenha-as salvas localmente
git stash

# 2. Atualize o seu projeto
git pull

# 3. Se salvou mudanças locais, reaplique essas mudanças por cima
git stash pop

```