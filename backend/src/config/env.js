import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 4001,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Logic check to stop the app immediately if the env is missing
if (!_config.JWT_SECRET) {
  console.error("❌ CRITICAL ERROR: JWT_SECRET is missing from .env");
  process.exit(1);
}

export const config = Object.freeze(_config);