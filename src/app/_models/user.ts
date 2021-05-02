import { Role } from "./role";

export class User {
    id: number;
    userName: string;
    password: string;
    role: Role;
    token?: string;
    prevUserName?:string;
}