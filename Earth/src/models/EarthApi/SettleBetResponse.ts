import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

export class SettleBetResponse {
    errorCode: number = 0;
    errorMessage: string = "";
    extraMessage: string = "";
    balance: number = 0;
    currency: string = "";
    currentTile: number = 0;
    isGameOver: boolean = true;
    previousGameState: GameStepEnum = GameStepEnum.none;
    gameState: GameStepEnum = GameStepEnum.none;
}