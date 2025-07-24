const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

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
].map((command) => command.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Register commands
(async () => {
  try {
    console.log(
      `🔄 Started refreshing ${commands.length} application (/) commands.`
    );

    // Choose one of the following options:

    // Option 1: Register globally (takes up to 1 hour to propagate)
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    // Option 2: Register for a specific guild (instant, uncomment to use)
    // const data = await rest.put(
    //     Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    //     { body: commands },
    // );

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`
    );
    console.log("Commands registered:", data.map((cmd) => cmd.name).join(", "));

    if (!process.env.GUILD_ID) {
      console.log(
        "💡 Global commands may take up to 1 hour to appear in Discord."
      );
      console.log(
        "💡 For instant testing, set GUILD_ID in .env and use guild-specific registration."
      );
    }
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
