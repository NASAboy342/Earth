export class BinaryResultService{
    private results: boolean[] = [];
    winRate: number = 80;
    stakeMultiplyRate: number = 4;
    stakeMultiplier: 0;


    getResult():boolean{
        let isWin = this.winRate > Phaser.Math.Between(0,100);
        if(isWin){
            this.stakeMultiplier += 1;
        }
        this.results.push(isWin);
        return isWin;
    }
}