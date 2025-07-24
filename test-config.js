const config = require("./config");
require("dotenv").config();

console.log("🔧 Testing Discord Weather Bot Configuration...\n");

// Check environment variables
const requiredEnvVars = ["DISCORD_TOKEN", "CLIENT_ID", "WEATHER_API_KEY"];
const missingVars = [];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

if (missingVars.length > 0) {
  console.log("\n❌ Missing environment variables:");
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  console.log(
    "\nPlease check your .env file and ensure all required variables are set."
  );
} else {
  console.log("\n✅ All required environment variables are set!");
}

// Check configuration
console.log("\n📋 Bot Configuration:");
console.log(`   Status: ${config.bot.status}`);
console.log(`   Activity: ${config.bot.activity}`);
console.log(`   Weather Units: ${config.weather.units}`);
console.log(`   Cooldown: ${config.cooldown}ms`);

console.log("\n🎨 Temperature Colors:");
Object.entries(config.colors).forEach(([temp, color]) => {
  console.log(`   ${temp}: ${color}`);
});

// Test weather API URL
console.log(`\n🌐 Weather API URL: ${config.weather.apiUrl}`);
console.log(`🖼️  Weather Icon URL: ${config.weather.iconUrl}`);

console.log("\n🚀 Configuration test complete!");
console.log("\nNext steps:");
console.log("1. Ensure all environment variables are set in .env");
console.log('2. Run "npm run register" to register slash commands');
console.log('3. Run "npm start" to start the bot');
