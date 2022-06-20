import dotenv from "dotenv";

dotenv.config();

interface Config {
	HttpPort: string;
	NodeEnv: string;
	Algorithm: string;
	SecretKey: string;
}

const config: Config = {
	HttpPort: getConf("HTTP_PORT", "3000"),
	NodeEnv: getConf("NODE_ENV", "development"),
	Algorithm: getConf("ALGORITHM", "aes-192-cbc"),
	SecretKey: getConf("SECRET_KEY", "Password")
};

function getConf(name: string, def: string = ""): string {
	if (process.env[name]) {
		return process.env[name] || "";
	}

	return def;
}

export default config;
