FROM node:20.18-bullseye-slim AS base

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && \
  apt-get install --no-install-recommends -y apt-transport-https curl make \
  gcc g++ gpg python3 python3-pip && \
  corepack enable

# Set cache dir so it can be shared between
# different docker stages
# RUN mkdir -p  /tmp/yarn-cache && \
#   yarn config set cache-folder /tmp/yarn-cache

FROM base AS build

WORKDIR /opt

COPY src ./src
COPY tsconfig.json tsconfig.build.json package.json .yarnrc.yml yarn.lock ./

# Run yarn install
RUN yarn install --immutable && \
  yarn run build

FROM build as final

WORKDIR /opt

COPY package.json .yarnrc.yml yarn.lock ./
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/build ./build

ENTRYPOINT [ "yarn", "start" ]
