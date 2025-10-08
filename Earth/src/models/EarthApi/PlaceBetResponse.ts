import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

export class PlaceBetResponse {
    errorCode: number = 0;
    errorMessage: string = "";
    extraMessage: string = "";
    currentTile: number = 0;
    isGameOver: boolean = false;
    previousGameState: GameStepEnum = GameStepEnum.none;
    gameState: GameStepEnum = GameStepEnum.none;
    balance: number = 0;
    currency: string = "";
}