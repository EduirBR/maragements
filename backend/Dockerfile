FROM node:23-alpine
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV CI=true
# Desactiva la restricción de edad mínima de forma global en el contenedor
ENV npm_config_minimum_release_age=0

WORKDIR /app
RUN corepack enable

# Buena práctica: copiar el lockfile junto al package.json para aprovechar la caché de Docker
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod

COPY . .

EXPOSE 8000
CMD ["node", "index.js"]