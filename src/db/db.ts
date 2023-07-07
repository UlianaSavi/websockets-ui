import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";
import { IGame } from "../models/game.model";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];
    private games: IGame[];

    constructor() {
        this.players = [];
        this.rooms = [];
        this.games = [];
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


    public initRoom = (reqData: string) => {
        const room = this.checkRooms(); // check if there some rooms for play
        const playerId: string = JSON.parse(reqData).socketId || '';
        const player = this.players.find((player) => player.socketId === playerId)

        if (room && player) {
            this.updateRoom(room, player);
            // this.deleteFullRoom(room);
            return this.startGame(room.roomUsers, player);
        }

        return player ? this.createRoom(player) : null;
        
    };

    private createRoom = (player: IPlayer) => {
        const newRoom: IRoom = {
            roomId: this.rooms.length + 1,
            roomUsers: [{
                name:  player?.name || '',
                index: player?.socketId || '',
            }],
        };

        this.rooms.push(newRoom);

        return this.rooms;
    };

    private updateRoom = (room: IRoom, player: IPlayer) => {
        const roomForUpdateIdx = this.rooms.findIndex((roomInArr) => roomInArr.roomId === room.roomId);
        const newPlayerToRoom: IRoomUser = {
            name: player?.name || '',
            index: player.socketId,
        };
        this.rooms[roomForUpdateIdx].roomUsers.push(newPlayerToRoom);
        return this.rooms;
    };

    private checkRooms = () => {
        const room = this.rooms.find((room) => room.roomUsers?.length < 2);
        if(room) {
            return room;
        }
        return null;
    };

    private deleteFullRoom = (room: IRoom) => {
        return this.rooms.filter((roomInArr) => roomInArr.roomId !== room.roomId);
    };

    private startGame = (roomUsers: IRoomUser[], player: IPlayer) => {
        const data: IGame = {
            idGame: this.games.length + 1,
            idPlayer: [roomUsers.at(0)?.index || 'unknown', player.socketId], // create srr with two players in current game
        }
        return data;
    };
};

export const db = new Database();
