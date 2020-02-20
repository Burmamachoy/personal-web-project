import {Roles} from "../usuarios/roles.entity";

export interface IJwtPayload {
    sub: number;
    username: string;
    roles: string;
}
