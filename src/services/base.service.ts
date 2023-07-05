export class BaseService {
    res: string | null;
    command: string;

    constructor(command: string) {
        this.res = null;
        this.command = command;
    }

    registration = () => {
        console.log(this.command);
        return this.res;
    };

    createNewGame = () => {
        console.log(this.command);
        return this.res;
    };

    addShips = () => {
        console.log(this.command);
        return this.res;
    };

    updateWins = () => {
        console.log(this.command);
        return this.res;
    };
}