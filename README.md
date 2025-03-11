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

  
## [Assista à demonstração da aplicação](https://vimeo.com/1004717844/0f6d0aec41?share=copy)
<a href="https://vimeo.com/1004717844/0f6d0aec41?share=copy" target="_blank">
    <img src="https://github.com/user-attachments/assets/e6dbb649-c833-48e2-9b66-5f910c3c7bc0" alt="thumb" width="300"/>
</a>





## 📜 Documentação da API Gemini

Para detalhes sobre a API do Google Gemini, consulte a [documentação técnica](https://ai.google.dev/gemini-api/docs/api-key) e [documentação de visão](https://ai.google.dev/gemini-api/docs/vision).

# Para rodar o projeto em sua máquina e conhecer o processo de inicialização, siga os seguintes passos:

### 🏠 Clonando o Repositório

Clone o repositório para sua máquina local:

```bash
     git clone git@github.com:thalissonsouzas/Shopper.git
     cd Shopper
```

### 🛠️ Configuração do Ambiente

Vá até o arquivo .env na raiz do projeto e adicione sua chave da API do GEMINI logo abaixo do endereço do nosso banco de dados:

```bash
     MONGO_URL=mongodb://mongo:27017/shopper
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
     docker-compose up -d
```

### 📝 Testando a API

Após iniciar o projeto, você pode testar os endpoints utilizando ferramentas como Postman ou Thunder Client. Certifique-se de que o Docker esteja rodando e que o ambiente esteja configurado corretamente.



## 🚨 Endpoints da API

### 1. `POST /`
- **Descrição**: Cadastro da leitura
Exemplo: localhost:3000/upload

    <table border="1">
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>customer_code</td>
                <td>1</td>
            </tr>
            <tr>
                <td>measure_type</td>
                <td>GAS</td>
            </tr>
            <tr>
                <td>measure_datetime</td>
                <td>2025-01-01</td>
            </tr>
            <tr>
                <td>image(selecione type File)</td>
                <td>/home/medicoes/relogio.jpg(selecione a imagem de leitura)</td>

</td>
            </tr>
        </tbody>
    </table>

    RESPONSE: {
    "image_url":"http://localhost:3000/media/6f2bb6af-a82e-424c-a146-1974e37d50a7.jpeg",
    "measure_value":"14",
    "measure_uuid":"6f2bb6af-a82e-424c-a146-1974e37d50a7"
    }




### 2. `GET /:customer/list` 
- **Descrição**: Lista as medições para um cliente específico
  Exemplo: localhost:3000/1/list

  ``` RESPONSE: {
  "customer_code": "1",
  "measures": [
    {
      "measure_uuid": "35a9a469-c72c-4cda-b1f4-2597945c4d5a",
      "image_url": "http://localhost:3000/media/35a9a469-c72c-4cda-b1f4-2597945c4d5a.jpeg",
      "measure_type": "GAS",
      "measure_datetime": "2025-01-10T00:00:00.000Z",
      "has_confirmed": false
    },
    {
      "measure_uuid": "76d84259-b5a2-46f9-95c9-adf1e4b7e097",
      "image_url": "http://localhost:3000/media/76d84259-b5a2-46f9-95c9-adf1e4b7e097.jpeg",
      "measure_type": "WATER",
      "measure_datetime": "2025-01-10T00:00:00.000Z",
      "has_confirmed": false
    }
  ]}





