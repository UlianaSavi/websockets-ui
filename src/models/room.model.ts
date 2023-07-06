export interface IRoom {
    roomId: number,
        roomUsers: IRoomUser[] | [],
}

interface IRoomUser {
    name: string,
    index: number
}
