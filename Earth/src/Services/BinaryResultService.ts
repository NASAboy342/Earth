export class BinaryResultService{
    private results: boolean[] = [];
    winRate: number = 0.9;

    getResult():boolean{
        let isWin = Phaser.Math.Between(0,1) < this.winRate;
        this.results.push(isWin);
        return isWin;
    }
}