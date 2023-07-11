import { IShipPos } from "./ship.model"

export interface IGame {
    idGame: number,
    idPlayer: number,
    idSecondPlayer: number
}

export interface IStartGame {
    ships: IShipPos[],
    currentPlayerIndex: number,
    start: number
}
