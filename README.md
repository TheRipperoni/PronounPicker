# Pronoun Picker

Pronoun Picker is a Bluesky Jetstream consumer that automatically assigns pronoun labels to users
based on their interactions (likes) with specific "anchor" posts. It allows users to self-identify
by liking a post corresponding to their pronouns.

## Features

- **Jetstream Integration**: Efficiently consumes events from the Bluesky network.
- **Automated Labeling**: Assigns labels via Ozone when a user likes a designated post.
- **Reset Functionality**: Allows users to clear their pronoun labels by liking a specific reset
  post.
- **Docker Support**: Easy deployment using Docker and Docker Compose.

## Requirements

- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A Bluesky account with labeling permissions (Ozone)
- Access to a Bluesky Jetstream endpoint

## Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TheRipperoni/PronounPicker.git
   cd pronoun-picker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   Copy the example environment file and fill in your details:

   ```bash
   cp .env.example .env
   ```

   _See [Environment Variables](#environment-variables) for details._

4. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### Development

To run the project using `tsx` (direct TypeScript execution):

```bash
npm start
```

### Production

After building the project:

```bash
node dist/index.js
```

### Docker

You can also run the application using Docker:

```bash
docker-compose up -d
```

## Scripts

- `npm start`: Runs the application using `tsx`.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist` folder.
- `npm run lint`: Runs ESLint for code quality.
- `npm run format`: Formats code using Prettier.

## Environment Variables

The following variables should be defined in your `.env` file:

| Variable                                 | Description                  | Example                                           |
| ---------------------------------------- | ---------------------------- | ------------------------------------------------- |
| `JETSTREAM_SUBSCRIPTION_ENDPOINT`        | Jetstream WebSocket endpoint | `wss://jetstream1.us-west.bsky.network/subscribe` |
| `JETSTREAM_SUBSCRIPTION_RECONNECT_DELAY` | Reconnect delay in ms        | `3000`                                            |
| `AGENT_SERVICE`                          | Bluesky API service URL      | `https://bsky.social`                             |
| `AGENT_IDENTIFIER`                       | Your bot's handle or DID     | `bot.bsky.social`                                 |
| `AGENT_PASSWORD`                         | Your bot's app password      | `your-app-password`                               |
| `OZONE_SERVICE`                          | Ozone service URL            | `https://ozone.bsky.social`                       |
| `DID`                                    | The DID of the labeler       | `did:plc:...`                                     |
| `LOG_LEVEL`                              | Logging verbosity            | `info`                                            |

_Note: Check `src/subscription.ts` for the mapping of post URIs to pronoun labels._

## License

This project is licensed under the [MIT License](LICENSE).
