FROM node:20.18-bullseye-slim as base

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && \
  apt-get install --no-install-recommends -y apt-transport-https curl make \
  gcc g++ gpg python3 python3-pip && \
  corepack enable

# Set cache dir so it can be shared between
# different docker stages
# RUN mkdir -p  /tmp/yarn-cache && \
#   yarn config set cache-folder /tmp/yarn-cache

FROM base as setup

WORKDIR /opt

# Copy root core files
COPY package.json /opt/package.json
COPY yarn.lock /opt/yarn.lock
COPY patches /opt/patches

# Run yarn install
RUN yarn install --immutable

COPY tsconfig.build.json /opt/tsconfig.build.json
COPY . /opt

RUN yarn build

FROM setup as final

WORKDIR /opt

COPY --from=setup /opt/build /opt/build
# COPY --from=setup /tmp/yarn-cache /tmp/yarn-cache

# Copy root package files and mediator
# app package

COPY package.json /opt/package.json
COPY yarn.lock /opt/yarn.lock

# # Copy patches folder
COPY patches /opt/patches

RUN yarn install --immutable && \
  yarn cache clean

# ENTRYPOINT [ "yarn", "start" ]
