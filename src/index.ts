import {resolve} from 'node:path';
import {existsSync} from "node:fs";

import {parseArguments, transpileInMemory} from "./utils";
import {DEFAULT_CONFIG} from "./configuration";
import {Configuration} from "./types";
import {showHelp} from "./help";

const CONFIGURATION_DEFAULT_FILE = 'mongo-migra.ts';

export * from './types';

function mergeEnvConfiguration(configuration: Configuration): Configuration {
  if (!configuration.env) {
    return configuration;
  }
  for (const parameter of Object.keys(configuration.env)) {
    const envVarName = configuration.env[parameter];
    const value = process.env[envVarName];
    if (value) {
      configuration[parameter] = value;
    }
  }
  return configuration;
}

async function execute(args: Map<string, string>): Promise<void> {
  const actionName = args.get('action');
  const verbose = args.has('verbose');
  let configFilePath: string;
  if (args.has('config')) {
    if (!existsSync(resolve(args.get('config')))) {
      throw new Error(`${resolve(args.get('config'))} doesn't exists`);
    }
  } else if (existsSync(resolve(CONFIGURATION_DEFAULT_FILE))) {
    configFilePath = resolve(CONFIGURATION_DEFAULT_FILE);
  }
  try {
    let configuration: Configuration;
    if (existsSync(configFilePath)) {
      const configFile = resolve(configFilePath);
      if (verbose) {
        console.log(`Using configuration file ${configFile}`);
      }
      configuration = (await transpileInMemory(configFile)).default;
    } else {
      if (verbose) {
        console.log('Using default configuration...');
      }
      configuration = DEFAULT_CONFIG;
    }
    configuration = mergeEnvConfiguration(configuration);
    if (verbose) {
      console.log('Configuration value', configuration);
    }
    await (await import((`./actions/${actionName}`))).default(configuration);
  } catch (error) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Invalid action name ${actionName}`);
    }
    throw error;
  }
}

if (process.argv.slice(2)[0] === '--help' || process.argv.slice(2)[0] === '-h') {
  showHelp();
} else {
  execute(parseArguments(['action'])).catch(error => {
    console.error(error);
    process.exit(1);
  });
}