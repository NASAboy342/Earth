export interface IEarthApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    extraMessage: string;
    responseData: T;
}
