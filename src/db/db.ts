import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";
import { IGame } from "../models/game.model";
import { IShip, IShipPos } from "../models/ship.model";
import { IAttack } from "../models/attack.model";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];
    private games: IGame[];
    private playersShips: IShip[];
    private roomToDelete: boolean;
    private start: string[];

    constructor() {
        this.players = [];
        this.rooms = [];
        this.games = [];
        this.playersShips = [];
        this.roomToDelete = false;
        this.start = [];
    }

    public registration = (reqData: string) => {
        const data = JSON.parse(reqData);

        const newPlayer: IPlayer = {
            name: data.name,
            password: data.password,
            socketId: data.socketId
        };

        this.players.push(newPlayer);
        return newPlayer;
    };

    public addToRoom = (reqData: string) => {
        const playerId: string = JSON.parse(reqData).socketId || '';
        const player = this.players.find((player) => player.socketId === playerId); // currrent player
        const reqRoomIdx: number = JSON.parse(reqData).indexRoom || '';
        const currRoomIdx: number = this.rooms.findIndex((room) => room.roomId === reqRoomIdx);

        const check = player && this.rooms[currRoomIdx].roomUsers.find((roomUser) => roomUser.index === player.socketId);

        if (player && !check) {
            this.rooms[currRoomIdx].roomUsers.push({
                name: player.name,
                index: player.socketId
            });
            
            return this.createGame(this.rooms[currRoomIdx].roomUsers);
        }

        // if (this.roomToDelete) {
        //     this.deleteFullRoom(this.rooms[currRoomIdx]);
        // }

        // if (fullRoom) {
        //     this.deleteFullRoom(this.rooms[currRoomIdx]);
        // }
    };

    public createRoom = (reqData: string) => {
        const playerId: string = JSON.parse(reqData).socketId || '';
        const player = this.players.find((player) => player.socketId === playerId);
        const newRoom: IRoom = {
            roomId: this.rooms.length + 1,
            roomUsers: [{
                name:  player?.name || '',
                index: player?.socketId || '',
            }],
        };

        return this.updateRoom(newRoom);
    };

    private updateRoom = (room?: IRoom) => {
        if (room) {
            this.rooms.push(room);
        }
        return this.rooms;
    };

    private deleteFullRoom = (room: IRoom) => {
        return this.rooms.filter((roomInArr) => roomInArr.roomId !== room.roomId);
    };

    private createGame = (roomUsers: IRoomUser[]) => {
        const data: IGame = {
            idGame: this.games.length + 1,
            idPlayer: [roomUsers.at(0)?.index || 'unknown', roomUsers.at(1)?.index || 'unknown'], // create arr with two players in current game
        }
        this.roomToDelete = true;

        return data;
    };

    public addShips = (reqData: string) => {
        const data: IShip = JSON.parse(reqData);
        
        const ship: IShip = {
            gameId: data.gameId,
            ships: data.ships,
            indexPlayer: data.indexPlayer
        }

        this.playersShips.push(ship);

        if (this.start.length < 2) {
            this.start.push(`ready: ${ data.indexPlayer }`);
            return ship;
        }
        if (this.start.length > 2) {
            this.start.splice(0, this.start.length);
        }

        return this.startGame(data.indexPlayer);
    };

    private startGame = (indexPlayer: string) => {
        const data = {
            ships: this.playersShips,
            currentPlayerIndex: indexPlayer,
            start: this.start.length
        };

        return data;
    }

    public attack = (reqData: string) => {
        const data = JSON.parse(reqData);
        const currPlayer = data.socketId || '';
        const status = this.checkStatus(data.x, data.y, currPlayer);
        const res = {
            position:
            {
                x: data.x,
                y: data.y,
            },
            currentPlayer: data.indexPlayer,
            status: status,
        }
        return res;
    }

    private checkStatus = (x: number, y: number, currPlayerIdx: string) => {
        const protectorIdx = this.playersShips.findIndex((ship: IShip) => ship.indexPlayer !== currPlayerIdx);

        const protectorShips = this.playersShips[protectorIdx]?.ships;
        let status = 'miss';
        
        protectorShips.forEach((ship) => {
            console.log('ship position: ', ship.position);
            
            console.log('x&y', x, y);
            console.log('x++++y', ship.position.x, ship.position.y);
            console.log('ship.position.x === x', ship.position.x === x);
            console.log('ship.position.x === x', ship.position.y === y);

            // TODO: допилить логику miss/shot (сейчас работает отлично только kill) - в помощь логи выше :)
            // Добавить поле для различия для кораблей, которые killed и не killed 
            // и радиусу клеток возле killed (если есть это поле - выстрел не проходит)
            if (ship.position.x === x && ship.position.y === y) {
                ship.position.x += NaN;
                ship.position.y += NaN;
                status = 'shot';
                ship.length = ship.length - 1;
                return status;
            }
            if (!ship.length) {
                status = 'killed';
                return status;
            }
        });
        return status;
    }

    // private asd = (room: IRoom, player: IPlayer) => {
    //     const roomForUpdateIdx = this.rooms.findIndex((roomInArr) => roomInArr.roomId === room.roomId);
    //     const newPlayerToRoom: IRoomUser = {
    //         name: player?.name || '',
    //         index: player.socketId,
    //     };
    //     if (this.rooms[roomForUpdateIdx].roomUsers.find((player) => player.index === newPlayerToRoom.index)) { // return if same player want to adds to room
    //         return null;
    //     }
    //     this.rooms[roomForUpdateIdx].roomUsers.push(newPlayerToRoom);
    //     return this.rooms;
    // };
};

export const db = new Database();
