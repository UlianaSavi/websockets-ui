import { IRoom, IRoomUser } from "../models/room.model";
import { IPlayer } from "../models/player.model";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];

    constructor() {
        this.players = [];
        this.rooms = [];
    }

    public registration = (reqData: string) => {
        const newPlayer: IPlayer = JSON.parse(reqData);

        this.players.push(newPlayer);
        return newPlayer;
    };


    public createRoom = (reqData: string) => {
        const room = this.checkRooms(); // check if there some rooms
        const playerId: string = JSON.parse(reqData).socketId || '';
        const player = this.players.find((player) => player.socketId === playerId)

        if (room && player) {
            this.updateRoom(room, player); // add user to room
        }

        const newRoom: IRoom = {
            roomId: this.rooms.length + 1,
            roomUsers: [{
                name:  player?.name || '',
                index: this.rooms.length + 1,
            }],
        };
        
        this.rooms.push(newRoom);
        
        return newRoom;
    };

    private updateRoom = (roomHave: IRoom, player: IPlayer) => {
        const roomForUpdateIdx = this.rooms.findIndex((roomInArr) => roomInArr.roomId === roomHave.roomId);
        const newPlayerToRoom: IRoomUser = {
            name: player?.name || '',
            index: this.rooms.length + 1,
        };
        this.rooms[roomForUpdateIdx].roomUsers.push(newPlayerToRoom);
        return this.rooms[roomForUpdateIdx];
    };

    private checkRooms = () => {
        const room = this.rooms.find((room) => room.roomUsers?.length < 2);
        if(room) {
            return room;
        }
        return null;
    };
};

export const db = new Database();
