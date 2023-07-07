import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";
import { IGame } from "../models/game.model";
import { IShip } from "../models/ship.model";
import { MAX_PLAYERS } from "../../constants";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];
    private games: IGame[];
    private shipsPos: IShip[];
    private roomToDelete: boolean;

    constructor() {
        this.players = [];
        this.rooms = [];
        this.games = [];
        this.shipsPos = [];
        this.roomToDelete = false;
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

        this.shipsPos.push(ship);
        if (this.shipsPos.length === MAX_PLAYERS) {
            this.startGame(data.indexPlayer);
        }

        return ship;
    };

    private startGame = (indexPlayer: number[]) => {
        const data = {
            ships: this.shipsPos,
            currentPlayerIndex: indexPlayer,
        };

        return data;
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
