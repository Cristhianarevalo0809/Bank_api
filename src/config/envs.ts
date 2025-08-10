import 'dotenv/config';
import * as joi from 'joi';

interface EnvVar {
    PORT: number;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_PORT: number;

}


const envSchema = joi.object({
    PORT: joi.number().default(3000),
    DATABASE_USERNAME: joi.string().required(),
    DATABASE_PASSWORD: joi.string().required(),
    DATABASE_NAME: joi.string().required(),
    DATABASE_HOST: joi.string().default('localhost'),
    DATABASE_PORT: joi.number().default(5432)
}).unknown(true);

const { error, value } = envSchema.validate({
    ...process.env,
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVar: EnvVar = value;

export const envs = {
    PORT: envVar.PORT,
    DATABASE_USERNAME: envVar.DATABASE_USERNAME,
    DATABASE_PASSWORD: envVar.DATABASE_PASSWORD,
    DATABASE_NAME: envVar.DATABASE_NAME,
    DATABASE_HOST: envVar.DATABASE_HOST,
    DATABASE_PORT: envVar.DATABASE_PORT
};