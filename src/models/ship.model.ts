export interface IShip {
    gameId: number,
    ships: IShipPos[],
    indexPlayer: number,
    socketId: number
};

export interface IShipPos {
    position: {
        x: number,
        y: number,
    },
    direction: boolean,
    length: number,
    type: shipsType
}
export interface IShipAfterShot {
    position: {
        x: number,
        y: number,
    },
    currentPlayer: number,
    status: string
}

export type IAfterAttack = {
    shipAfterShot: IShipAfterShot,
    newShipPos: IShipPos
}

export enum shipsType {
    small = "small",
    medium = "medium",
    large = "large",
    huge = "huge"
};
