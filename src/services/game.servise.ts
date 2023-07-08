import { db } from "../db/db";

export class GameService {
    res: string | null;
    command: string;
    reqData: string;

    constructor(command: string, reqData: string) {
        this.res = null;
        this.command = command;
        this.reqData = reqData;
    }

    finishGame = () => {
        console.log(this.command);
        return this.res;
    };

    attack = () => {
        const data = JSON.stringify(db.attack(this.reqData));
        this.res = data;
        return this.res;
    };

    randAttack = () => {
        console.log(this.command);
        return this.res;
    };
}