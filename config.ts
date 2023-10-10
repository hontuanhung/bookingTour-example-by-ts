import path from "path";
import dotenv from "dotenv";

// Parsing the evn file
dotenv.config({ path: path.resolve(__dirname, "./.evn") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  LOCAL_DATABASE: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  LOCAL_DATABASE: string;
}

// Loading process.env as ENV interjace

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    LOCAL_DATABASE: process.env.LOCAL_DATABASE,
  };
};
// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
