export class BinaryResultService{
    private results: boolean[] = [];
    winRate: number = 80;
    stakeMultiplyRate: number = 10;
    stakeMultiplier: 0;


    getResult():boolean{
        let isWin = this.winRate > Phaser.Math.Between(0,100);
        if(isWin){
            this.stakeMultiplier += 1;
        }
        this.results.push(isWin);
        return isWin;
    }

    getTileValue(tileCount: number): number[] {
        let tileValues: number[] = [];
        tileValues.push(this.stakeMultiplyRate/100);
        for(let i = 1; i < tileCount; i++){
            tileValues.push(((tileValues[i-1]*100) *2)/100); 
        }
        return tileValues;
    }
}