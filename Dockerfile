# Usa una imágen base de Node.js
FROM node:23.11-alpine3.21

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /

# Copia el archivo package.json y yarn.lock al contenedor
COPY package*.json yarn.lock ./

# Instala yarn globalmente en el contenedor si no esta instalado
RUN if ! command -v yarn > /dev/null; then npm install -g yarn; fi

# Instalamos las dependencias de la app
RUN yarn install

# Copia el resto del código de la app
COPY . .

# Contruye la app
RUN yarn build

# Comando para ejecutar la app
CMD ["node", "dist/main.js"]