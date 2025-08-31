export class BinaryResultService{
    
    private results: boolean[] = [];
    winRate: number = 80;
    stakeMultiplyRate: number = 10;
    stakeMultiplier: number = 0;
    tileCount: number = 0;
    reachableTile: number = 0;

    getPreCalculatedResult(currentTileIndex: number): boolean {
      return currentTileIndex < this.reachableTile
    }

    findReachableTile() {
        let isReachLose = false;
        for(let i = 1; (i <= this.tileCount && !isReachLose); i++){
            let isWin = this.getResult();
            if(isWin){
                this.reachableTile = i;
            }
            else{
                isReachLose = true;
            }
        }
    }

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
        this.tileCount = tileCount;
        this.findReachableTile();
        return tileValues;
    }
}