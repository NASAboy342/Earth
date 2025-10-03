import { GetPlayerInfoRequest } from "../models/EarthApi/GetPlayerInfoRequest";
import { GameSettings } from "../models/GameSettings";
import { PlayerInfo } from "../models/PlayerInfo";
import { EarthApiService } from "./EarthApiService";

export class PlayerService {
    
    playerInfo: PlayerInfo;
    stake: number = 0;
    gameSettings: GameSettings = new GameSettings();
    stakes: number[] = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    earthApiService: EarthApiService;
    
    constructor(){
        this.playerInfo = new PlayerInfo();
        this.resetStake();
        this.earthApiService = new EarthApiService();
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

    async InitPlayerInfo(username: string) {
        const getPlayerInfoRequest = new GetPlayerInfoRequest();
        getPlayerInfoRequest.username = username;

        const response = await this.earthApiService.GetPlayerInfo(getPlayerInfoRequest);
        if (response.errorCode !== 0) {
            console.error("Failed to get player info:", response.errorMessage);
            return;
        }
        this.playerInfo = response.responseData;
    }
}