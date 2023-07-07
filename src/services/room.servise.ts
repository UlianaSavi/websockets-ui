import { db } from "../db/db";

export class RoomService {
    res: string | null;
    command: string;
    reqData: string;

    constructor(command: string, reqData: string) {
        this.res = null;
        this.command = command;
        this.reqData = reqData;
    }

    initRoom = () => {
        const result = db.initRoom(this.reqData);
        this.res = JSON.stringify(result);
        return this.res;
    };

    updateRoom = () => {
        console.log(this.command);
        return this.res;
    };
}