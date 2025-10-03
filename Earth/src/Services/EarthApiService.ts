import type { IEarthApiResponse } from "../models/EarthApi/IEarthApiResponse";
import type { IGetGameInfosResponse } from "../models/EarthApi/IGetGameInfosResponse";

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
}
