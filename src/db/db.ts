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
        const playerId: number = JSON.parse(reqData)?.socketId;
        const player = this.players.find((player) => player?.socketId === playerId); // currrent player
        
        const reqRoomIdx: number = JSON.parse(reqData)?.indexRoom;
        const currRoomIdx: number = this.rooms.findIndex((room) => room?.roomId === reqRoomIdx);
        const secondPlayer = this.players.find((player) => player?.socketId !== playerId);

        const check = player && this.rooms[currRoomIdx].roomUsers.find((roomUser) => roomUser.index === player.socketId);
        if (player && secondPlayer && !check) {
            return this.createGame(playerId, secondPlayer?.socketId);
            
        }
        if (player && !secondPlayer) {
            this.rooms[currRoomIdx].roomUsers.push({
                name: player && player.name,
                index: player && player.socketId
            });
        }
        return null;
    };

    public createRoom = (reqData: string) => {
        const playerId: number = JSON.parse(reqData)?.socketId || 0;
        const player = this.players.find((player) => player?.socketId === playerId);
        if (player) {
            const newRoom: IRoom = {
                roomId: player?.socketId || 0,
                roomUsers: [{
                    name:  player?.name || '',
                    index: player?.socketId || 0,
                }],
            };
    
            return this.updateRoom(newRoom);
        }
        return null;
        
    };

    private updateRoom = (room: IRoom) => {
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

        return data;
    };

    public addShips = (reqData: string) => {
        const data: IShip = JSON.parse(reqData);
        
        const ships: IShip = {
            gameId: data.gameId,
            ships: data.ships,
            indexPlayer: data.socketId,
            socketId: data.socketId
        }

        this.shipsMap.push(ships);

        if (this.start.length < MAX_PLAYERS) {
            this.start.push(`ready: ${ data.socketId }`);
            
            return ships;
        } else {
            return this.startGame(ships, data.ships);
        }
    };

    private startGame = (lastAddShips: IShip, shipPos: IShipPos[]) => {
        const data: IStartGame = {
            startGame: {
                ships: shipPos,
                currentPlayerIndex: lastAddShips?.socketId,
                start: MAX_PLAYERS
            },
            lastAddShips: lastAddShips
        };
        return data;
    }

    public attack = (reqData: string) => {
        const data = JSON.parse(reqData);
        const currPlayerIdx = data?.socketId || 0;

        const protectorIdx = this.shipsMap.findIndex((ship: IShip) => ship.indexPlayer !== currPlayerIdx);
        const protectorShips = this.shipsMap[protectorIdx]?.ships;
        
        const attackRes = getShotRes(data.x, data.y, protectorShips, currPlayerIdx);

        // TODO: сейчас при выстреле возвращает null --> понять почему и поправить
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
