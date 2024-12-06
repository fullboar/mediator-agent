<h1 align="center" ><b>BC Wallet Mediator</b></h1>

<!-- TODO: Add relevant badges, like CI/CD, license, codecov, etc. -->

<p align="center">
  <a href="https://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" />
  </a>
  <a href="https://github.com/animo/animo-mediator/pkgs/container/animo-mediator">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/animo/animo-mediator?display_name=tag&label=docker%20tag">
  </a>
</p>

---

This repo contains a [Mediator](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0046-mediators-and-relays/README.md) Agent for usage with [Hyperledger Aries and DIDComm v1 agents](https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0004-agents). It is built using [Aries Framework JavaScript](https://github.com/hyperledger/aries-framework-javascript).

Why should you use this mediator?

- Automatically set up mediation with the mediator using the [Mediator Coordination Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0211-route-coordination).
- Pick up messages implicitly using WebSockets, using the [Pickup V1 Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0212-pickup), and the [Pickup V2 Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0685-pickup-v2).
- Configured to persist queued messages for recipient in a postgres.
- Use the pre-built docker image for easy deployment of your mediator.

## Getting Started

> If you want to deploy the mediator based on the pre-built docker image, please see the [Using Docker](#using-docker) section.

### Development

For development work the mediator agent can be run locally. However, it is recommended to use the accompanying `devContainer` as it will provide a PostgreSQL database and a mediator agent.

```bash
yarn install
```

**Pro Tip 🤓:** If you don't have yarn installed, you can install it using npm. If you're on a Linux system make sure "corepack" is enabled becase this depends on yarn ^4.0.0.

Copy the `.env.example` file to `.env` replacing the values with your own. The `AGENT_ENDPOINTS` variable should be populated with an endpoint accessible by other agents. If this is a local development environment, you can use `http://localhost:3110,ws://localhost:3110`. If you need to expose the mediator to the internet, you can use a service like [ngrok](https://ngrok.com/).

And run dev to start the development server:

```bash
yarn dev
```

**Pro Tip 🤓:** If you are not using PostgreSQL for local development a SQLite will be used. It will create a directory called `~/.aft` where the wallet is stored. If your endpoints or wallet key changes you should delete this directory and allow the mediator to re-create it.

### Production

To start the server in production, you can run the following commands. Make sure to set the environment variables as described below.

Transpile the TypeScript code to JavaScript so that it can be run with a typical `node` command:

```bash
yarn build
```

Run the agent using the following command:

```bash
yarn start
```

After the agent is started, a multi-use invitation will be printed to the console.

### Connecting to the Mediator

When you've correctly started the mediator agent, and have extracted the invitation from the console, you can use the invitation to connect to the mediator agent. To connect to the mediator and start receiving messages, there's a few steps that need to be taken:

1. Connect to the mediator from another agent using the created [Out Of Band Invitation](https://github.com/hyperledger/aries-rfcs/blob/main/features/0434-outofband/README.md)

2. Request mediation from the mediator using the [Mediator Coordination Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0211-route-coordination).

3. Start picking up messages implicitly by connecting using a WebSocket and sending any DIDComm message to authenticate, the [Pickup V1 Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0212-pickup), or the [Pickup V2 Protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0685-pickup-v2). We recommend using the Pickup V2 Protocol.

If you're using an Aries Framework JavaScript agent as the client, you can follow the [Mediation Tutorial](https://aries.js.org/guides/next/tutorials/mediation) from the Aries Framework JavaScript docs. Please note, the tutorial points to the `next` version, which is for `0.4.0` at the time of writing. If the link stops working, please check the `0.4.0` docs for the tutorial.

## Environment Variables

You can provide a number of environment variables to run the agent. The following table lists the environment variables that can be used.

## Environment Variables

You can provide a number of environment variables to run the agent. The following table lists the environment variables that can be used.

| Variable                   | Description                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `AGENT_ENDPOINTS`          | Comma-separated list of endpoints for the agent (e.g., `http://localhost:3110,ws://localhost:3110`). |
| `AGENT_NAME`               | Name of the agent.                                                                                   |
| `AGENT_PORT`               | Port on which the agent will run.                                                                    |
| `WALLET_NAME`              | Name of the wallet. Will also be database name.                                                      |
| `WALLET_KEY`               | Secret key for the wallet.                                                                           |
| `POSTGRES_HOST`            | Host of the PostgreSQL database.                                                                     |
| `POSTGRES_USER`            | Username for the PostgreSQL database.                                                                |
| `POSTGRES_PASSWORD`        | Password for the PostgreSQL database.                                                                |
| `POSTGRES_ADMIN_USER`      | Admin username for the PostgreSQL database.                                                          |
| `POSTGRES_ADMIN_PASSWORD`  | Admin password for the PostgreSQL database.                                                          |
| `USE_PUSH_NOTIFICATIONS`   | Enable or disable push notifications (`true` or `false`).                                            |
| `NOTIFICATION_WEBHOOK_URL` | URL for the notification webhook.                                                                    |

## Using Docker

The mediator agent can be run using the pre-built docker image. The docker image is available on [GitHub Packages](https://github.com/fullboar/mediator-agent/pkgs/container/mediator-agent%2Fmediator).

There is an accompanying `docker-compose.yml` file in the `.devContainer` that can be used to run the mediator agent and a PostgreSQL database. The `Dockerfile` in the root of the repository can be used to build the docker image for production deployments.

## Roadmap

The contents in this repository started out as a simple mediator built using Aries Framework JavaScript that can be used for development. Over time we've added some features, but there's still a lot we want to add to this repository over time. Some things on the roadmap:

- Expose a `did:web` did, so you can directly connect to the mediator using only a did
- Allow for customizing the message queue implementation, so it doesn't have to be stored in the Askar database, but rather in high-volume message queue like Kafka.
- DIDComm v2 support
- Sending push notifications to the recipient when a message is queued for them
- Allow to control acceptance of mediation requests

## 🖇️ How To Contribute

You're welcome to contribute to this repository. Please make sure to open an issue first for bigger changes!

This mediator is open source and you're more than welcome to customize and use it to create your own mediator.

All commits must contain a `Signed-off-by` line in the commit message (`git commit -s`). This line certifies that you wrote the patch or otherwise have the right to contribute the material. The full Developer Certificate of Origin text is at the bottom of this README.

## License

The Animo Mediator is licensed under the Apache License Version 2.0 (Apache-2.0).

## Attribution

This project is based on the work of the [Animo Mediator](https://github.com/animo/animo-mediator) and subsequent contributions to the [credebl Mediator Agent](https://github.com/credebl/mediator-agent).

## Troubleshooting

If you are running in produciton and see this in the Agent logs:

```bash
2024-12-06 17:06:48.058 UTC [58] LOG:  unexpected EOF on client connection with an open transaction
```

You are probably providing too little resources to the Agent. Increase the memory first, then the CPU if that fails.
