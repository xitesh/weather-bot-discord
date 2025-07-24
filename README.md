# Discord Weather Bot 🌤️

A Discord bot that provides weather information using slash commands. Get current weather data for any city worldwide with a simple `/weather` command.

## Features

- 🌍 Global weather data using OpenWeatherMap API
- ⚡ Discord slash commands for easy interaction
- 🎨 Beautiful embedded responses with weather icons
- 🌡️ Temperature in both Celsius and Fahrenheit
- 💧 Detailed weather information (humidity, pressure, wind, visibility)
- 🎯 Optional country code specification for more precise results

## Setup Instructions

### 1. Prerequisites

- Node.js (version 16 or higher)
- A Discord application and bot token
- OpenWeatherMap API key

### 2. Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token
5. Go to the "OAuth2" > "URL Generator" section
6. Select scopes: `bot` and `applications.commands`
7. Select bot permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
8. Use the generated URL to invite the bot to your server

### 3. OpenWeatherMap API Setup

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Copy the API key

### 4. Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_client_id_here
   GUILD_ID=your_discord_guild_id_here
   WEATHER_API_KEY=your_openweathermap_api_key_here
   ```

### 5. Running the Bot

Start the bot with:

```bash
npm start
```

Or for development:

```bash
npm run dev
```

## Usage

Once the bot is running and invited to your server, you can use the following slash command:

### `/weather city:[city_name] country:[country_code]`

- `city` (required): The name of the city
- `country` (optional): Two-letter country code (e.g., US, UK, CA, FR)

**Examples:**

- `/weather city:London`
- `/weather city:London country:UK`
- `/weather city:New York country:US`
- `/weather city:Tokyo country:JP`

## Response Information

The bot provides comprehensive weather information including:

- 🌡️ Current temperature (°C and °F)
- 🤔 "Feels like" temperature
- 💧 Humidity percentage
- 🏔️ Atmospheric pressure
- 💨 Wind speed
- 👁️ Visibility distance
- 📊 Min/Max temperatures (when available)
- 🌤️ Weather condition with icon

## Command Registration

The bot registers slash commands globally by default, which may take up to 1 hour to propagate across all Discord servers. For instant testing, you can uncomment the guild-specific command registration in the code and set your `GUILD_ID` in the `.env` file.

## Troubleshooting

### Common Issues

1. **"Application did not respond"**

   - Check if your Discord token is correct
   - Ensure the bot has proper permissions in your server

2. **Weather data not loading**

   - Verify your OpenWeatherMap API key is correct and active
   - Check if the city name is spelled correctly
   - Try adding a country code for more precise results

3. **Slash commands not appearing**
   - Wait up to 1 hour for global commands to register
   - Or use guild-specific registration for instant testing
   - Ensure the bot has `applications.commands` scope

### Dependencies

- `discord.js`: Discord API wrapper
- `axios`: HTTP client for weather API requests
- `dotenv`: Environment variable management

## Contributing

Feel free to contribute to this project by:

- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is licensed under the MIT License.
