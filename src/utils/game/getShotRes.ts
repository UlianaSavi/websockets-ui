import { IAfterAttack, IShipAfterShot, IShipPos, shipsType } from "../../models/ship.model";

export const getShotRes = (x: number, y: number, protectorShips: IShipPos[], playerId: string) => {
    let status = 'miss';
    let newShipPos: IShipPos | null  = null; // ship who get shot get new position of head for update ships map
    let shipAfterShot: IShipAfterShot | null  = null; // ship who get shot with old coordinates for front

    protectorShips.forEach((ship) => {
        const shipSize = getShipSize(ship);
        if (ship.position.x === x && ship.position.y === y) { // if shot not miss
            if (shipSize > 1) {
                if (ship.direction) { // vertical ship
                    status = 'shot';
                    newShipPos = {
                        position: {
                            x: ship.position.x,
                            y: ship.position.y - 1
                        },
                        direction: ship.direction,
                        length: ship.length - 1,
                        type: ship.type
                    };
                    shipAfterShot = {
                        position: {
                            x: ship.position.x,
                            y: ship.position.y,
                        },
                        currentPlayer: playerId,
                        status: status
                    };
                } else { // horisontal ship
                    status = 'shot';
                    newShipPos = {
                        position: {
                            x: ship.position.x + 1,
                            y: ship.position.y
                        },
                        direction: ship.direction,
                        length: ship.length - 1,
                        type: ship.type
                    };
                    shipAfterShot = {
                        position: {
                            x: ship.position.x,
                            y: ship.position.y,
                        },
                        currentPlayer: playerId,
                        status: status
                    };
                }
            } else {
                status = 'kill';
            }
        }
    });
    if (shipAfterShot && newShipPos) {
        const res: IAfterAttack = { shipAfterShot, newShipPos  };
        return res;
    } else {
        return null;
    }
}

const getShipSize = (ship: IShipPos) => {
    let shipSize: number | null = null;
    switch (ship.type) {
        case shipsType.small:
            shipSize = 1;
            break;
        case shipsType.medium:
            shipSize = 2;
            break;
        case shipsType.large:
            shipSize = 3;
            break;
        case shipsType.huge:
            shipSize = 4;
            break;
    }
    return shipSize;
}