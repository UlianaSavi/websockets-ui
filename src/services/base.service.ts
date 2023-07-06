import { db } from "../db/db";
import { IResult } from "../models/result.model";

export class BaseService {
    res: string | null;
    command: string;
    reqData: string;

    constructor(command: string, reqData: string) {
        this.res = null;
        this.command = command;
        this.reqData = reqData;
    }

    registration = () => {
        const data = db.registration(this.reqData) ? JSON.stringify(db.registration(this.reqData)) : null;
        this.res = data
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