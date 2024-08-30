![TypeScript](https://img.shields.io/badge/TypeScript-v5.0.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-v10.0.0-EA484A)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0.0-green)
![Docker](https://img.shields.io/badge/Docker-v20.10.8-blue)
![API](https://img.shields.io/badge/API-REST-yellow)
[Google Gemini]

# Image Reading Service

Bem-vindo ao projeto do teste técnico da Shopper! Este projeto é uma API para o gerenciamento e leitura de medidores de água e gás utilizando tecnologia de IA para processar imagens.

## 💡 Descrição

Este projeto tem como objetivo fornecer uma API para a leitura e gerenciamento de medidores de água e gás. O usuário envia uma foto da leitura do medidor e o backend utiliza tecnologia de Inteligência Artificial para processar a imagem, extrair o valor da medição e salvar as informações em um banco de dados.

## 🚀 Funcionalidades

- **Recepção de Imagens**: Recebe imagens contendo a leitura de medidores e converte em formato base64.
- **Processamento de Imagens**: Utiliza a API Google Gemini para extrair valores numéricos das imagens enviadas.
- **Armazenamento de Dados**: Salva as medições e detalhes pertinentes no banco de dados MongoDB.
- **Endpoints Principais**:
  - `POST /upload`: Recebe uma imagem, consulta a API Gemini, salva no banco de dados e retorna o status.
  - `PATCH /confirm`: Permite confirmar ou corrigir o valor da medição lido pela IA.
  - `GET /:customer/list`: Lista todas as medições realizadas por um cliente, com a opção de filtrar por tipo de medição.

## 🧩 Tecnologias Usadas

- **Backend**: Node.js, NestJS, TypeScript
- **Banco de Dados**: MongoDB
- **Gerenciamento de Containers**: Docker
- **Integração LLM**: Google Gemini

## 📜 Documentação da API Gemini

Para detalhes sobre a API do Google Gemini, consulte a [documentação técnica](https://ai.google.dev/gemini-api/docs/api-key) e [documentação de visão](https://ai.google.dev/gemini-api/docs/vision).


# Para rodar o projeto em sua máquina e conhecer o processo de inicialização, siga os seguintes passos:

### 🏠 Clonando o Repositório

Clone o repositório para sua máquina local:
```bash
     git clone git@github.com:thalissonsouzas/Shopper.git
     cd seu-repositorio
```
### 🛠️ Configuração do Ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```bash
     GEMINI_API_KEY=<sua-chave-api-gemini>
```
### 🚀 Instalando Dependências
Instale as dependências do projeto:
```bash
     npm install
```
### 🐳 Rodando o Projeto com Docker
Para iniciar o projeto e todos os serviços necessários, utilize o Docker:
```bash
     docker-compose up --build
```

### 📝 Testando a API
Após iniciar o projeto, você pode testar os endpoints utilizando ferramentas como Postman ou Thunder Client. Certifique-se de que o Docker está rodando e que o ambiente está configurado corretamente.

