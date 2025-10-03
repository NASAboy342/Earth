import { BetStatusEnum } from "../../Enums/EarthApi/BetStatusEnum";

export class SettleRequest{
    username: string = "";
    amount: number = 0;
    stake: number = 0;
    betStatus: BetStatusEnum = BetStatusEnum.Refund;

}