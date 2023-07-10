import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";
import { IGame } from "../models/game.model";
import { IShip, IShipPos } from "../models/ship.model";
import { MAX_PLAYERS } from "../../constants";
import { getShotRes } from "../utils/game/getShotRes";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];
    private games: IGame[];
    private shipsMap: IShip[];
    private roomToDelete: boolean;
    private start: string[];

    constructor() {
        this.players = [];
        this.rooms = [];
        this.games = [];
        this.shipsMap = [];
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
            
            return this.createGame(this.rooms[currRoomIdx].roomUsers, playerId);
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

    private createGame = (roomUsers: IRoomUser[], playerId: string) => {
        const secondPlayer = roomUsers.find((user) => user.index !== playerId);
        const data: IGame = {
            idGame: this.games.length + 1,
            idPlayer: playerId,
            idSecondPlayer: secondPlayer?.index || ''
        };

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

        console.log('HERE this.shipsMap.push: ship --> ', ship);
        
        this.shipsMap.push(ship);

        if (this.start.length < 2) {
            this.start.push(`ready: ${ data.indexPlayer }`);
            this.shipsMap.slice(0, 2);

            return ship;
        } else {
            return this.startGame(data.ships, data.indexPlayer);
        }
    };

    private startGame = (ships: IShipPos[], indexPlayer: string) => {
        const data = {
            ships: ships,
            currentPlayerIndex: indexPlayer,
            start: MAX_PLAYERS
        };

        return data;
    }

    public attack = (reqData: string) => {
        const data = JSON.parse(reqData);
        const currPlayerIdx = data.socketId || '';

        const protectorIdx = this.shipsMap.findIndex((ship: IShip) => ship.indexPlayer !== currPlayerIdx);
        console.log('protectorIdx HERE', protectorIdx);
        console.log('this.shipsMap HERE', this.shipsMap.length);
        
        const protectorShips = this.shipsMap[protectorIdx]?.ships;
        
        const attackRes = getShotRes(data.x, data.y, protectorShips, currPlayerIdx);
        if (attackRes) {
            this.updateShipsMap(attackRes?.newShipPos, protectorShips, protectorIdx);
            return attackRes?.shipAfterShot;
        }
        return null;
    }

    private updateShipsMap = (newShipPos: IShipPos, shipsFor: IShipPos[], protectorIdx: number) => {
        const idx = shipsFor.findIndex((ship: IShipPos) => ship.position.x === newShipPos.position.x && ship.position.y === newShipPos.position.y);
        this.shipsMap[protectorIdx].ships[idx].position.x = newShipPos.position.x; // new position for
        this.shipsMap[protectorIdx].ships[idx].position.y = newShipPos.position.y; // new position for
    }
};

export const db = new Database();
