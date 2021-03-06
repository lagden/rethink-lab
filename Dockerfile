FROM node:8.6.0-alpine
MAINTAINER Thiago Lagden <docker@lagden.in>

RUN apk add --update python make g++

# variáveis de ambiente
ENV PREFIX_DEBUG=chat-websocket
ENV DEBUG=$PREFIX_DEBUG:*
ENV NODE_ENV=production
ENV PORT=3000
ENV RDB_HOST=rethinkdb
ENV RDB_PORT=28015
ENV HOME=/home/node
ENV APP=$HOME/chat-websocket

# cria a pasta do app, copia os arquivos e ajusta as permissões
RUN mkdir $APP
COPY . $APP
RUN chown -R node:node $HOME

# troca de usuário (node) e instala os pacotes
USER node
WORKDIR $APP
RUN npm i --progress=false --production

# libera a porta e roda o comando
EXPOSE $PORT
CMD ["node", "index.js"]

# docker exec -it {container_name} ash
