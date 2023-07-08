import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import dotenv from 'dotenv';
import { BASE_COMMANDS, GAME_COMMANDS, HOSTNAME, MAX_PLAYERS, MAX_SWIPS_LEN, ROOM_COMMANDS } from '../constants';
import { WebSocket, WebSocketServer } from 'ws';
import { Router } from './router';
import { randomUUID } from 'crypto';

dotenv.config();
const port = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000;

type WebSocketClient = WebSocket & {
    socketId: string;
};

const httpServer = http.createServer((req, res) => {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

httpServer.listen(port, HOSTNAME, () => {
    console.log(`Server running at http://${ HOSTNAME }:${ port }/`);
});

const wsServer = new WebSocketServer({
    server: httpServer
});


wsServer.on('connection', function connection(ws: WebSocketClient) {
    ws.socketId = randomUUID();

    ws.on('error', (err) => {
        console.log(err.message);
    });

    ws.on('message', function message(chunk) {
        const req = JSON.parse(chunk.toString());
        let command = req.type || 'unknown';
        let turn: string | null = null;
        let message: string | null = null;
        let reqData = command !== ROOM_COMMANDS.CREATE_ROOM ? JSON.parse(req.data || '') : {};
        console.log(reqData);
        

        reqData.socketId = ws.socketId; // add socket id to request data for identify player

        const data = Router.route(command, JSON.stringify(reqData)) || '';
        const parsedData = JSON.parse(data);
        const playersForStart = data && parsedData.idPlayer || null;

        if (command === ROOM_COMMANDS.CREATE_ROOM) {
            command = ROOM_COMMANDS.UPDATE_ROOM;
        }
        if (data && command === ROOM_COMMANDS.UPDATE_ROOM && parsedData.idGame) {
            command = GAME_COMMANDS.CREATE_GAME;
        }
        if (data && command === ROOM_COMMANDS.ADD_TO_ROOM && parsedData.idGame) {
            command = GAME_COMMANDS.CREATE_GAME;
        }
        
        if (data && command === BASE_COMMANDS.ADD_SHIPS && parsedData?.start === MAX_PLAYERS) {
            command = GAME_COMMANDS.START_GAME;
            turn = parsedData?.indexPlayer?.at(0);
        }
        if (!data && command === ROOM_COMMANDS.ADD_TO_ROOM) {
            message = 'Player already in this room!';
        }

        if (data !== 'null') {
            
            let res: {} = {
                type: command,
                data: data,
                id: req.id
            };
        
            if (res && !message) {
                console.log(`On command: "${ command }" result was sended successfully.`);
                ws.send(JSON.stringify(res));
            }
            if (message) {
                console.log(`On command: "${ command }" you get the message:\n${ message }`);
            }
        
            wsServer.clients.forEach((wsClient) => {
                if (playersForStart && playersForStart.find((playerId: string) => playerId === ws.socketId)) {
                    wsClient.send(JSON.stringify(res));
                }
                if (command === ROOM_COMMANDS.UPDATE_ROOM) {
                    wsClient.send(JSON.stringify(res));
                }
                if (command === GAME_COMMANDS.START_GAME) {
                    wsClient.send(JSON.stringify(res));
                    
                    // где-то тут ошибка с "[object Object]" is not valid JSON at JSON.parse
                    // TODO: пофиксить это, а затем добавить:
                    // 1) отправлять turn после каждого attack() и на start_game()
                    // 2) вынести как-то отдельно формирование turn res (а не как щас - внутри wsServer.clients.forEach - тут должен быть уже сформированный выше res)
                    // 3) реализовать attack()
                    // 4) реализовать randomAttack()
                    if (turn) {
                        res = {
                            type: 'turn',
                            data:
                                {
                                    currentPlayer: turn,
                                },
                            id: 0
                        };
                        wsClient.send(JSON.stringify(res));
                    }
                }
            });
        
            ws.send(JSON.stringify(res));
        }

    });

});

wsServer.on('close', () => console.log('The connection has been closed successfully.'));

wsServer.on('error', (err) => console.log(err.message));
