import { PlayerTraining } from "./playerTraining";
import { TrainingType } from "./trainingType";

export class Training {
    id?: number;
    date?: Date;
    dateString?: string;
    duration?: string;
    trainingType?: TrainingType;
    playerTrainings?: PlayerTraining[]
}
