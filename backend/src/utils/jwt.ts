import jwt,{ SignOptions } from "jsonwebtoken"
import { UserDocument } from "../models/user.model"
import { config } from "../config/app.config"
import { getEnv } from "./get-env";
import { number } from "zod";


export type AccessTPayload = {
    userId:UserDocument["_id"]; 
};
type SignOptsAndSecret = SignOptions & {
    secret:string;
};
const defaults: SignOptions = {
    audience:["user"],
};

// const expiresInSeconds: number = parseInt(getEnv("JWT_EXPIRES_IN_SECONDS", "86400"));
// export const accessTokenSignOptions: SignOptsAndSecret = {
//   expiresIn: expiresInSeconds,
//   secret: getEnv("JWT_SECRET"),
// };

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT_EXPIRES_IN as any,
  secret: config.JWT_SECRET,
};

export const signJwtToken = (
    payload: AccessTPayload,
    options?:SignOptsAndSecret
)=>{
    const {secret,...opts} =options || accessTokenSignOptions;
    return jwt.sign(payload,secret,{
        ...defaults,
        ...opts,
    });
};
