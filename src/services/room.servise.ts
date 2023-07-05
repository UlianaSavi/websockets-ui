export class RoomService {
    res: string | null;
    command: string;

    constructor(command: string) {
        this.res = null;
        this.command = command;
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