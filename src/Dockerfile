# Imagen base de Node.js 22.14.0
FROM node:22.14.0-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del backend
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]