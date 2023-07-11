import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";
import { IGame, IStartGame } from "../models/game.model";
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
        const playerId: number = JSON.parse(reqData).socketId || 0;
        const player = this.players.find((player) => player.socketId === playerId); // currrent player
        const reqRoomIdx: number = JSON.parse(reqData).indexRoom || 0;
        const currRoomIdx: number = this.rooms.findIndex((room) => room.roomId === reqRoomIdx);
        const secondPlayer = this.players.find((player) => player.socketId !== playerId);

        const check = player && this.rooms[currRoomIdx].roomUsers.find((roomUser) => roomUser.index === player.socketId);

        if (player && !check) {
            this.rooms[currRoomIdx].roomUsers.push({
                name: player.name,
                index: player.socketId
            });
            
            return this.createGame(playerId, secondPlayer?.socketId || 0);
        } else {
            return null;
        }

        // if (this.roomToDelete) {
        //     this.deleteFullRoom(this.rooms[currRoomIdx]);
        // }

        // if (fullRoom) {
        //     this.deleteFullRoom(this.rooms[currRoomIdx]);
        // }
    };

    public createRoom = (reqData: string) => {
        const playerId: number = JSON.parse(reqData).socketId || 0;
        const player = this.players.find((player) => player.socketId === playerId);
        const newRoom: IRoom = {
            roomId: player?.socketId || 0,
            roomUsers: [{
                name:  player?.name || '',
                index: player?.socketId || 0,
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

    private createGame = (playerId: number, secondPlayerId: number) => {
        const data: IGame = {
            idGame: playerId,
            idPlayer: playerId,
            idSecondPlayer: secondPlayerId
        };

        this.roomToDelete = true;
        return data;
    };

    public addShips = (reqData: string) => {
        const data: IShip = JSON.parse(reqData);

        const ships: IShip = {
            gameId: data.gameId,
            ships: data.ships,
            indexPlayer: data.indexPlayer
        }

        this.shipsMap.push(ships);

        // TODO: 
        //  должны отправиться вторые ships, а затем startGame() --> то есть в консоли в браузере:
        //  у первого игрока: add_ships() --> start_game();
        //  у второго игрока: add_ships() --> start_game();
        // сейчас у тебя add_ships() два раза
        if (this.start.length < 2) {
            this.start.push(`ready: ${ data.indexPlayer }`);
            this.shipsMap.slice(0, 2);

            return ships;
        } else {
            return this.startGame(data.ships, data.indexPlayer);
        }
    };

    private startGame = (ships: IShipPos[], indexPlayer: number) => {
        const data: IStartGame = {
            ships: ships,
            currentPlayerIndex: indexPlayer,
            start: MAX_PLAYERS
        };

        return data;
    }

    public attack = (reqData: string) => {
        const data = JSON.parse(reqData);
        const currPlayerIdx = data.socketId || 0;

        const protectorIdx = this.shipsMap.findIndex((ship: IShip) => ship.indexPlayer !== currPlayerIdx);
        const protectorShips = this.shipsMap[protectorIdx]?.ships;
        
        const attackRes = getShotRes(data.x, data.y, protectorShips, currPlayerIdx);
        // console.log('attackRes ---> ', attackRes);

        if (attackRes) {
            this.updateShipsMap(attackRes?.newShipPos, protectorShips, protectorIdx);
            return attackRes?.shipAfterShot;
        }
        return null;
    }

    private updateShipsMap = (newShipPos: IShipPos, shipsFor: IShipPos[], protectorIdx: number) => {
        const idx = shipsFor.findIndex((ship: IShipPos) => 123 /* get idx of shotted ship)  */);
        this.shipsMap[protectorIdx].ships[idx].position.x = newShipPos.position.x; // new position for shotted ship on x
        this.shipsMap[protectorIdx].ships[idx].position.y = newShipPos.position.y; // new position for shotted ship on y
    }
};

export const db = new Database();
