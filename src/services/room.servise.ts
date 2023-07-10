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

    createRoom = () => {
        const result = db.createRoom(this.reqData);
        this.res = JSON.stringify(result);
        return this.res;
    };

    addToRoom = () => {
        const result = db.addToRoom(this.reqData) || null;
        this.res = JSON.stringify(result); 
        return this.res;
    };
}