import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

export class SetNextGameStateRequest {
  username: string = "";
  previousGameState: GameStepEnum = GameStepEnum.none;
  nextGameState: GameStepEnum = GameStepEnum.none;
}