const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const axios = require("axios");
const config = require("./config");
require("dotenv").config();

class WeatherBot {
  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.cooldowns = new Map(); // For rate limiting
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.once("ready", () => {
      console.log(`✅ ${this.client.user.tag} is online and ready!`);

      // Set bot status
      this.client.user.setPresence({
        activities: [
          {
            name: config.bot.activity,
            type: ActivityType.Watching,
          },
        ],
        status: "online",
      });

      this.registerSlashCommands();
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "weather") {
        await this.handleWeatherCommand(interaction);
      }
    });
  }

  async registerSlashCommands() {
    const commands = [
      new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Get current weather information for a city")
        .addStringOption((option) =>
          option
            .setName("city")
            .setDescription("The city name to get weather for")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("country")
            .setDescription("Country code (optional, e.g., US, UK, CA)")
            .setRequired(false)
        ),
    ];

    try {
      console.log("🔄 Registering slash commands...");

      // Register commands globally (takes up to 1 hour to propagate)
      await this.client.application.commands.set(commands);

      // Or register commands for a specific guild (instant)
      // const guild = this.client.guilds.cache.get(process.env.GUILD_ID);
      // if (guild) {
      //     await guild.commands.set(commands);
      // }

      console.log("✅ Slash commands registered successfully!");
    } catch (error) {
      console.error("❌ Error registering slash commands:", error);
    }
  }

  async handleWeatherCommand(interaction) {
    // Check for cooldown
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldownAmount = config.cooldown;

    if (this.cooldowns.has(userId)) {
      const expirationTime = this.cooldowns.get(userId) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return await interaction.reply({
          content: `⏰ Please wait ${timeLeft} more second(s) before using this command again.`,
          ephemeral: true,
        });
      }
    }

    // Set cooldown
    this.cooldowns.set(userId, now);
    setTimeout(() => this.cooldowns.delete(userId), cooldownAmount);

    await interaction.deferReply();

    const city = interaction.options.getString("city");
    const country = interaction.options.getString("country");

    try {
      const weatherData = await this.getWeatherData(city, country);
      const embed = this.createWeatherEmbed(weatherData);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Weather API Error:", error);

      let errorMessage = `❌ Sorry, I couldn't fetch weather data for "${city}".`;

      if (error.response && error.response.status === 404) {
        errorMessage +=
          " Please check the city name and try again. You can also try adding a country code.";
      } else if (error.response && error.response.status === 401) {
        errorMessage =
          "❌ Weather service is temporarily unavailable. Please try again later.";
      } else {
        errorMessage += " Please try again later.";
      }

      await interaction.editReply({
        content: errorMessage,
        ephemeral: true,
      });
    }
  }

  async getWeatherData(city, country = null) {
    const query = country ? `${city},${country}` : city;
    const url = config.weather.apiUrl;

    const params = {
      q: query,
      appid: this.weatherApiKey,
      units: config.weather.units,
    };

    const response = await axios.get(url, {
      params,
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  }

  createWeatherEmbed(data) {
    const { name, sys, main, weather, wind, visibility } = data;
    const weatherCondition = weather[0];

    // Convert temperature to Fahrenheit for additional info
    const tempF = Math.round((main.temp * 9) / 5 + 32);
    const feelsLikeF = Math.round((main.feels_like * 9) / 5 + 32);

    // Get weather icon
    const iconUrl = `${config.weather.iconUrl}${weatherCondition.icon}@2x.png`;

    // Create color based on temperature using config
    let color = config.colors.cool; // Default
    if (main.temp >= 30) color = config.colors.hot;
    else if (main.temp >= 20) color = config.colors.warm;
    else if (main.temp >= 10) color = config.colors.mild;
    else if (main.temp >= 0) color = config.colors.cool;
    else color = config.colors.cold;

    const embed = new EmbedBuilder()
      .setTitle(`🌤️ Weather in ${name}, ${sys.country}`)
      .setDescription(
        weatherCondition.description.charAt(0).toUpperCase() +
          weatherCondition.description.slice(1)
      )
      .setColor(color)
      .setThumbnail(iconUrl)
      .addFields(
        {
          name: "🌡️ Temperature",
          value: `${Math.round(main.temp)}°C (${tempF}°F)`,
          inline: true,
        },
        {
          name: "🤔 Feels Like",
          value: `${Math.round(main.feels_like)}°C (${feelsLikeF}°F)`,
          inline: true,
        },
        {
          name: "💧 Humidity",
          value: `${main.humidity}%`,
          inline: true,
        },
        {
          name: "🏔️ Pressure",
          value: `${main.pressure} hPa`,
          inline: true,
        },
        {
          name: "💨 Wind Speed",
          value: `${wind.speed} m/s`,
          inline: true,
        },
        {
          name: "👁️ Visibility",
          value: `${Math.round(visibility / 1000)} km`,
          inline: true,
        }
      )
      .setFooter({
        text: "Powered by OpenWeatherMap API",
        iconURL:
          "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_60x60.png",
      })
      .setTimestamp();

    // Add min/max temperature if available
    if (main.temp_min && main.temp_max) {
      const minTempF = Math.round((main.temp_min * 9) / 5 + 32);
      const maxTempF = Math.round((main.temp_max * 9) / 5 + 32);
      embed.addFields({
        name: "📊 Min/Max",
        value: `${Math.round(main.temp_min)}°C / ${Math.round(
          main.temp_max
        )}°C\n(${minTempF}°F / ${maxTempF}°F)`,
        inline: true,
      });
    }

    return embed;
  }

  start() {
    if (!process.env.DISCORD_TOKEN) {
      console.error("❌ DISCORD_TOKEN is not set in environment variables");
      process.exit(1);
    }

    if (!process.env.WEATHER_API_KEY) {
      console.error("❌ WEATHER_API_KEY is not set in environment variables");
      process.exit(1);
    }

    this.client.login(process.env.DISCORD_TOKEN);
  }
}

// Start the bot
const bot = new WeatherBot();
bot.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  bot.client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  bot.client.destroy();
  process.exit(0);
});
