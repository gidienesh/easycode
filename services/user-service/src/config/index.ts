import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT,
  // Add other environment variables that your service uses
  // Example: DATABASE_URL: process.env.DATABASE_URL,
} = process.env;

// You might want to provide defaults or throw errors if essential config is missing
if (!PORT) {
  console.warn('PORT not set in environment, defaulting to 3001 or dynamically assigned');
}
