import { BASE_COMMANDS, GAME_COMMANDS, ROOM_COMMANDS } from '../constants';
import { BaseService } from './services/base.service';
import { GameService } from './services/game.servise';
import { RoomService } from './services/room.servise';

export class Router {
    public static route = (command: string) => {
        const baseServise = new BaseService(command);
        const roomServise = new RoomService(command);
        const gameServise = new GameService(command);

        let res: string | null = null;

        switch (command) {
            case BASE_COMMANDS.REG:
                res = baseServise.registration();
                break;
            case BASE_COMMANDS.CREATE_GAME:
                res = baseServise.createNewGame();
                break;
            case BASE_COMMANDS.ADD_SHIPS:
                res = baseServise.addShips();
                break;
            case BASE_COMMANDS.UPDATE_WINS:
                res = baseServise.updateWins();
                break;
            case ROOM_COMMANDS.ADD_TO_ROOM:
                res = roomServise.addToRoom();
                break;
            case ROOM_COMMANDS.CREATE_ROOM:
                res = roomServise.createRoom();
                break;
            case ROOM_COMMANDS.UPDATE_ROOM:
                res = roomServise.updateRoom();
                break;
            case GAME_COMMANDS.START_GAME:
                res = gameServise.startGame();
                break;
            case GAME_COMMANDS.FINISH:
                res = gameServise.finishGame();
                break;
            case GAME_COMMANDS.ATTACK:
                res = gameServise.attack();
                break;
            case GAME_COMMANDS.RAND_ATTACK:
                res = gameServise.randAttack();
                break;
            default:
                console.log('unknown command! :(');
                break;
        }

        return res;
    }
}