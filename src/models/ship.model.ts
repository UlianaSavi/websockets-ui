export interface IShip {
    gameId: number,
    ships:
        [
            {
                position: {
                    x: number,
                    y: number,
                },
                direction: boolean,
                length: number,
                type: shipsType,
            }
        ],
    indexPlayer: number[]
};

export enum shipsType {
    small = "small",
    medium = "medium",
    large = "large",
    huge = "huge"
};
