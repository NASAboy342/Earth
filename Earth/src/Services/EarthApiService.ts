import type { GetPlayerInfoRequest } from "../models/EarthApi/GetPlayerInfoRequest";
import type { IEarthApiResponse } from "../models/EarthApi/IEarthApiResponse";
import type { IGetGameInfosResponse } from "../models/EarthApi/IGetGameInfosResponse";
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
}
