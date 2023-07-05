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
        console.log(this.command);
        return this.res;
    };

    addToRoom = () => {
        console.log(this.command);
        return this.res;
    };

    updateRoom = () => {
        console.log(this.command);
        return this.res;
    };
}