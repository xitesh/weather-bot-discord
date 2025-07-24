module.exports = {
  // Bot configuration
  bot: {
    // Status message when bot is ready
    status: "Providing weather updates! Use /weather",
    // Activity type: 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'
    activityType: "WATCHING",
    activity: "the weather ⛅",
  },

  // Weather API configuration
  weather: {
    // Default units: 'metric' (Celsius), 'imperial' (Fahrenheit), 'kelvin'
    units: "metric",
    // API base URL
    apiUrl: "https://api.openweathermap.org/data/2.5/weather",
    // Icon base URL
    iconUrl: "https://openweathermap.org/img/wn/",
  },

  // Embed colors based on temperature (in Celsius)
  colors: {
    hot: "#e74c3c", // >= 30°C (86°F)
    warm: "#f39c12", // >= 20°C (68°F)
    mild: "#f1c40f", // >= 10°C (50°F)
    cool: "#3498db", // >= 0°C (32°F)
    cold: "#9b59b6", // < 0°C (32°F)
  },

  // Command cooldown in milliseconds
  cooldown: 5000, // 5 seconds

  // Rate limiting
  rateLimit: {
    maxRequests: 10, // Maximum requests
    timeWindow: 60000, // Per minute (60 seconds)
  },
};
