import type { DeductRequest } from "../models/EarthApi/DeductRequest";
import type { DeductResponse } from "../models/EarthApi/DeductResponse";
import type { GetPlayerInfoRequest } from "../models/EarthApi/GetPlayerInfoRequest";
import type { IEarthApiResponse } from "../models/EarthApi/IEarthApiResponse";
import type { IGetGameInfosResponse } from "../models/EarthApi/IGetGameInfosResponse";
import type { SettleRequest } from "../models/EarthApi/SettleRequest";
import type { SettleResponse } from "../models/EarthApi/SettleResponse";
import type { PlayerInfo } from "../models/PlayerInfo";

export class EarthApiService {
    
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'https://earth-api.ppiinn.net';
        // this.baseUrl = 'http://localhost:5113';
    }

    public async getGameInfos(): Promise<IEarthApiResponse<IGetGameInfosResponse>> {
        const response = await fetch(`${this.baseUrl}/game/get-all-games`);
        return response.json();
    }

    async GetPlayerInfo(request: GetPlayerInfoRequest): Promise<IEarthApiResponse<PlayerInfo>> {
        const response = await fetch(`${this.baseUrl}/player/get-player-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });
        return response.json();
    }

    async Deduct(deductRequest: DeductRequest): Promise<IEarthApiResponse<DeductResponse>> {
        const response = await fetch(`${this.baseUrl}/player/deduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deductRequest)
        });
        return response.json();
    }

    async Settle(settleRequest: SettleRequest): Promise<IEarthApiResponse<SettleResponse>> {
        const response = await fetch(`${this.baseUrl}/player/settle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settleRequest)
        });
        return response.json();
    }
}
