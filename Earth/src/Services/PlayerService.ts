import { BetStatusEnum } from "../Enums/EarthApi/BetStatusEnum";
import { DeductRequest } from "../models/EarthApi/DeductRequest";
import { GetPlayerInfoRequest } from "../models/EarthApi/GetPlayerInfoRequest";
import { SettleRequest } from "../models/EarthApi/SettleRequest";
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
    
    async deduct(amount: number){
        let deductRequest = new DeductRequest();
        deductRequest.username = this.playerInfo.username;
        deductRequest.amount = amount;

        let deductResponse = await this.earthApiService.Deduct(deductRequest);
        if(deductResponse.errorCode !== 0){
            console.error("Failed to deduct:", deductResponse.errorMessage);
            return;
        }
        this.playerInfo.balance = deductResponse.responseData.balance;
        this.stake = amount;
        
    }

    async settle(amount: number){
        let settleRequest = new SettleRequest();
        settleRequest.username = this.playerInfo.username;
        settleRequest.amount = amount;
        settleRequest.stake = this.stake;
        settleRequest.betStatus = amount > this.stake ? BetStatusEnum.Win : BetStatusEnum.Lose;

        let settleResponse = await this.earthApiService.Settle(settleRequest);
        if(settleResponse.errorCode !== 0){
            console.error("Failed to settle:", settleResponse.errorMessage);
            return;
        }

        this.playerInfo.balance = settleResponse.responseData.balance;
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