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
        const data = db.registration(this.reqData);
        this.res = JSON.stringify(data);
        return this.res;
    };

    addShips = () => {
        const data = db.addShips(this.reqData);
        this.res = JSON.stringify(data);
        return this.res;
    };
}