import type { BetAndRunLoginRequest } from "../models/EarthApi/BetAndRunLoginRequest";
import type { BetAndRunLoginResponse } from "../models/EarthApi/BetAndRunLoginResponse";
import type { DeductRequest } from "../models/EarthApi/DeductRequest";
import type { DeductResponse } from "../models/EarthApi/DeductResponse";
import type { GetBetResultRequest } from "../models/EarthApi/GetBetResultRequest";
import type { GetBetResultResponse } from "../models/EarthApi/GetBetResultResponse";
import type { GetPlayerInfoRequest } from "../models/EarthApi/GetPlayerInfoRequest";
import type { IEarthApiResponse } from "../models/EarthApi/IEarthApiResponse";
import type { IGetGameInfosResponse } from "../models/EarthApi/IGetGameInfosResponse";
import type { MoveToNextTileRequest } from "../models/EarthApi/MoveToNextTileRequest";
import type { MoveToNextTileResponse } from "../models/EarthApi/MoveToNextTileResponse";
import type { PlaceBetRequest } from "../models/EarthApi/PlaceBetRequest";
import type { PlaceBetResponse } from "../models/EarthApi/PlaceBetResponse";
import type { SetNextGameStateRequest } from "../models/EarthApi/SetNextGameStateRequest";
import type { SetNextGameStateResponse } from "../models/EarthApi/SetNextGameStateResponse";
import type { SettleBetRequest } from "../models/EarthApi/SettleBetRequest";
import type { SettleBetResponse } from "../models/EarthApi/SettleBetResponse";
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
    async BetAndRunLogin(request: BetAndRunLoginRequest): Promise<IEarthApiResponse<BetAndRunLoginResponse>> {
        const response = await fetch(`${this.baseUrl}/bet-and-run/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });
        return response.json();
    }
    async SetNextGameState(setNextGameStepRequest: SetNextGameStateRequest) : Promise<IEarthApiResponse<SetNextGameStateResponse>> {
        const response = await fetch(`${this.baseUrl}/bet-and-run/set-next-game-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(setNextGameStepRequest)
        });
        return response.json();
    }
    async BetAndRunPlaceBet(placeBetRequest: PlaceBetRequest) : Promise<IEarthApiResponse<PlaceBetResponse>> {
      const response = await fetch(`${this.baseUrl}/bet-and-run/place-bet`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(placeBetRequest)
      });
      return response.json();
    }
    async GetBetResult(getBetResultRequest: GetBetResultRequest): Promise<IEarthApiResponse<GetBetResultResponse>> {
      const response = await fetch(`${this.baseUrl}/bet-and-run/get-bet-result`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(getBetResultRequest)
      });
      return response.json();
    }
    async MoveToNextTile(moveToNextTileRequest: MoveToNextTileRequest) : Promise<IEarthApiResponse<MoveToNextTileResponse>> {
      const response = await fetch(`${this.baseUrl}/bet-and-run/move-to-next-tile`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(moveToNextTileRequest)
      });
      return response.json();
    }
    async SettleBet(settleBetRequest: SettleBetRequest): Promise<IEarthApiResponse<SettleBetResponse>> {
      const response = await fetch(`${this.baseUrl}/bet-and-run/settle-bet`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(settleBetRequest)
      });
      return response.json();
    }
    
    
}