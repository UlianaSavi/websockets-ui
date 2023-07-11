import { IShip, IShipPos } from "./ship.model"

export interface IGame {
    idGame: number,
    idPlayer: number,
    idSecondPlayer: number
}

export interface IStartGame {
    startGame: {
        ships: IShipPos[],
        currentPlayerIndex: number,
        start: number
    },
    lastAddShips: IShip
}
