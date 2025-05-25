import { PlayerInfo } from "../models/PlayerInfo";

export class PlayerService {
    playerInfo: PlayerInfo;
    stake: number = 0;
    
    constructor(){
        this.playerInfo = {
            username: "TestPlayer",
            id: 10,
            balance: 1000,
            currency: "USD"
        }
    }
    
    deduct(amount: number){
        this.playerInfo.balance - amount;
        this.stake = amount;
    }

    settle(amount: number){
        this.playerInfo.balance + amount
        this.resetStake();
    }
    resetStake() {
        this.stake = 0;
    }
}