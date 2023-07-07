import { BASE_COMMANDS, GAME_COMMANDS, ROOM_COMMANDS } from '../constants';
import { BaseService } from './services/base.service';
import { GameService } from './services/game.servise';
import { RoomService } from './services/room.servise';

export class Router {
    public static route = (command: string, reqData: string) => {
        const baseServise = new BaseService(command, reqData);
        const roomServise = new RoomService(command, reqData);
        const gameServise = new GameService(command, reqData);

        let res: string | null = null;

        switch (command) {
            case BASE_COMMANDS.REG:
                res = baseServise.registration();
                break;
            case ROOM_COMMANDS.CREATE_ROOM:
                res = roomServise.initRoom();
                break;
            case ROOM_COMMANDS.ADD_TO_ROOM:
                res = roomServise.initRoom();
                break;
            // case BASE_COMMANDS.UPDATE_WINS:
            //     res = baseServise.updateWins();
            //     break;
            // case GAME_COMMANDS.FINISH:
            //     res = gameServise.finishGame();
            //     break;
            // case GAME_COMMANDS.ATTACK:
            //     res = gameServise.attack();
            //     break;
            // case GAME_COMMANDS.RAND_ATTACK:
            //     res = gameServise.randAttack();
            //     break;
            default:
                console.log('unknown command! :(');
                break;
        }

        return res;
    }
}