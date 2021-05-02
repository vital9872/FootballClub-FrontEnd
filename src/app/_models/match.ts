import { MatchLocation } from "./matchLocation";
import { PlayerMatches } from "./playerMatches";

export class Match {
    id?: number;
    matchLocation?: MatchLocation;
    matchTournamentId?: number;
    startDate?: Date;
    startDateString?:string;
    clubEnemyName?:string;
    playerMatches?: PlayerMatches[];
    ticketSales?: number;
    outcome?: number;
    team1Goals?: number;
    team2Goals?: number;
}
