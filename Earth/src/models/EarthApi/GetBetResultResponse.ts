import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

export class GetBetResultResponse {
    errorCode: number = 0;
    errorMessage: string = "";
    extraMessage: string = "";
    currentTile: number = 0;
    isGameOver: boolean = true;
    previousGameState: GameStepEnum = GameStepEnum.none;
    gameState: GameStepEnum = GameStepEnum.none;
    cashOutAmount: number = 0;
}