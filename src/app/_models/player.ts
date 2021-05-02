import { Contract } from "./contract";
import { Position } from "./position";

export class Player {
    id?: number;
    firstName?: string;
    lastName?: string;
    position?: Position
    birth?: Date;
    birthString?: string;
    isCaptain?: boolean;
    club_id?: number;
    contract?: Contract
}