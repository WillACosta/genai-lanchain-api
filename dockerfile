FROM node:20-alpine

RUN npm install -g pnpm@9.7.0
WORKDIR /usr/workspace/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p $PNPM_HOME

COPY . .

RUN pnpm config set store-dir "$PNPM_HOME/.pnpm-store" --global
RUN apk add --no-cache openssl
RUN pnpm install --frozen-lockfile

EXPOSE 3000
CMD [ "pnpm", "start" ]w