export class ClockService {
    stratTime: Date;
    TimeSpentInMilliseconds: number = 0;
    TimeSpentInCentiseconds: number = 0;
    TimeSpentInSeconds: number = 0;
    deltaTimeInCentiseconds: number = 0;

    constructor(){
        this.stratTime = new Date();
    }

    Tick(){
        let currentTime = new Date();
        this.TimeSpentInMilliseconds = currentTime.getTime() - this.stratTime.getTime();
        this.deltaTimeInCentiseconds = this.TimeSpentInMilliseconds / 10 - this.TimeSpentInCentiseconds;
        this.TimeSpentInCentiseconds = this.TimeSpentInMilliseconds / 10;
        this.TimeSpentInSeconds = this.TimeSpentInMilliseconds / 1000;
    }
}