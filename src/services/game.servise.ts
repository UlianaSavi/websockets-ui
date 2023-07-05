export class GameService {
    res: string | null;
    command: string;
    reqData: string;

    constructor(command: string, reqData: string) {
        this.res = null;
        this.command = command;
        this.reqData = reqData;
    }

    startGame = () => {
        console.log(this.command);
        return this.res;
    };

    finishGame = () => {
        console.log(this.command);
        return this.res;
    };

    attack = () => {
        console.log(this.command);
        return this.res;
    };

    randAttack = () => {
        console.log(this.command);
        return this.res;
    };
}