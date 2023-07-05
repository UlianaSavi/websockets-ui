import { IPlayer } from "../models/player.model";

class Database {
    private players: IPlayer[];

    constructor() {
        this.players = [{
                name: 'Tester',
                password: '123456'
            },
            {
                name: 'Tester 2',
                password: '123456'
            }
        ];
    }

    public registration = (reqData: string) => {
        const newPlayer: IPlayer = JSON.parse(reqData);

        this.players.push(newPlayer);
        return newPlayer;
    };
};

export const db = new Database();
