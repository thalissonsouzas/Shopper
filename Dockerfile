# Use uma imagem base oficial do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e o package-lock.json (se houver)
COPY package*.json ./

# Instale as dependências
RUN npm install --production

# Copie o restante do código da aplicação
COPY . .

# Copy env file
COPY .env .env

# Compilar a aplicação para produção
RUN npm run build

# Exponha a porta que a aplicação utilizará
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/main.js"]