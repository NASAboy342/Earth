import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

export class BetAndRunLoginResponse {
    errorCode: number = 0;
    errorMessage: string = "";
    extraMessage: string = "";
    sessionId: string = "";
    currentTile: number = 0;
    previousGameState: GameStepEnum = GameStepEnum.none;
    gameState: GameStepEnum = GameStepEnum.none;
}