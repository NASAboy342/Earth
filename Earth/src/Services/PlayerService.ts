import { GameSettings } from "../models/GameSettings";
import { PlayerInfo } from "../models/PlayerInfo";

export class PlayerService {
    playerInfo: PlayerInfo;
    stake: number = 0;
    gameSettings: GameSettings = new GameSettings();
    stakes: number[] = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    
    constructor(){
        this.playerInfo = {
            username: "TestPlayer",
            id: 10,
            balance: 1000,
            currency: "USD"
        }
        this.resetStake();
    }
    
    deduct(amount: number){
        this.playerInfo.balance -= amount;
        this.stake = amount;
    }

    settle(amount: number){
        this.playerInfo.balance += amount
        this.resetStake();
    }
    resetStake() {
        this.stake = this.stakes[0];
    }
    addStake() {
        const nextStake = this.stakes[this.stakes.indexOf(this.stake) + 1];
        if (nextStake) {
            this.stake = nextStake;
        }
    }
    minusStake() {
        const previousStake = this.stakes[this.stakes.indexOf(this.stake) - 1];
        if (previousStake) {
            this.stake = previousStake;
        }
    }
}