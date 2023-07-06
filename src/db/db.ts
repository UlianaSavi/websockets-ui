import { IRoom } from "../models/room.model";
import { IPlayer } from "../models/player.model";

class Database {
    private players: IPlayer[];
    private rooms: IRoom[];

    constructor() {
        this.players = [];
        this.rooms = [{
                roomId: 0,
                roomUsers: [],
            },
        ];
    }

    public registration = (reqData: string) => {
        const newPlayer: IPlayer = JSON.parse(reqData);

        this.players.push(newPlayer);
        return newPlayer;
    };

    public createRoom = (playerPass: string) => {
        const room = this.checkRooms(); // check if there some rooms
        if (room) {
            this.updateRoom(room, playerPass); // add user to room
        }
        const newRoom: IRoom = {
            roomId: this.rooms.length + 1,
            roomUsers: [{
                name: ``,
                index: this.rooms.length + 1,
            }],
        };
        
        this.rooms.push(newRoom);
        
        return newRoom;
    };

    private updateRoom = (room: IRoom, playerPass: string) => {
        const roomIdx = this.rooms.findIndex((roomInArr) => roomInArr.roomId === room.roomId); // for update room
        // room.roomUsers.push() add player to room if after than room.player.len === 2 -> start game() else -> log()
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
