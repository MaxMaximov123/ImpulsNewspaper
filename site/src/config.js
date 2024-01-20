import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', new URL(import.meta.url)) });

// ---------------------------------------------------------------------- //

const config = {};

config.apiHost = process.env.API_HOST;

// ---------------------------------------------------------------------- //

export default config;
