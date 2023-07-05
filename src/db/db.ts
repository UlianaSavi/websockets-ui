import { IPlayer } from "../models/player.model";

class Database {
    private players: IPlayer[];

    constructor() {
        this.players = [
            {
                name: 'Tester',
                index: 0,
                error: false,
                errorText: '',
            },
            {
                name: 'Tester 2',
                index: 1,
                error: false,
                errorText: '',
            }
        ];
    }

    public registration = (reqData: string) => {
        return reqData;
    };

};

export const db = new Database();
