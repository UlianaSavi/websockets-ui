export class GameService {
    res: string | null;
    command: string;

    constructor(command: string) {
        this.res = null;
        this.command = command;
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