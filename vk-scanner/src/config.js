import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

// ---------------------------------------------------------------------- //

const config = {};

config.sourceKey = process.env.SOURCE_KEY;
config.restartTime = process.env.RESTART_TIME;

config.sourceUrls = {
	IMPULS: 'https://vk.com/impulse131',
	HSE: 'https://vk.com/hseolymp',
	BMSTU: 'https://vk.com/olymp_bmstu',
	INNOPOLIS: 'https://vk.com/innopolisu'
}

config.sourceUrl = config.sourceUrls[config.sourceKey];

config.database = {
	pool: {
		min: Number(process.env.DATABASE_POOL_MIN),
		max: Number(process.env.DATABASE_POOL_MAX),
	},
	url: process.env.DATABASE_URL,
	schema: process.env.DATABASE_SCHEMA || 'public',
};	

// ---------------------------------------------------------------------- //

export default config;
