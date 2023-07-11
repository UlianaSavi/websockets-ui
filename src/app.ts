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
    socketId: number;
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

let num: number[] = [];

wsServer.on('connection', function connection(ws: WebSocketClient) {
    ws.socketId = num.length;
    num.push(ws.socketId);

    ws.on('error', (err) => {
        console.log(err.message);
    });

    ws.on('message', function message(chunk) {
        const req = JSON.parse(chunk.toString());
        
        let command: string = req.type || 'unknown';
        let turn: string | null = null;
        let message: string | null = null;
        let reqData = command !== ROOM_COMMANDS.CREATE_ROOM ? JSON.parse(req.data || '') : {};

        console.log(command);

        reqData.socketId = ws.socketId; // add socket id to request data for identify player

        const data = Router.route(command, JSON.stringify(reqData)) || 'null';
        
        const parsedData = data !== 'null' ? JSON.parse(data) : null;

        if (!parsedData && command === ROOM_COMMANDS.ADD_TO_ROOM) {
            message = 'Player already in this room!';
        }
        if (message) {
            console.log(`On command: "${ command }" you get the message:\n${ message }`);
        }

        if (parsedData) {
            const playersForStart = [parsedData?.idPlayer, parsedData?.idSecondPlayer];

            let res = {
                type: command,
                data: data,
                id: req.id
            };

            if (command === ROOM_COMMANDS.CREATE_ROOM) {
                res.type = ROOM_COMMANDS.UPDATE_ROOM;
            }
            if (res.type === ROOM_COMMANDS.UPDATE_ROOM && parsedData?.idGame) {
                res.type = GAME_COMMANDS.CREATE_GAME;
            }
            if (command === ROOM_COMMANDS.ADD_TO_ROOM && parsedData?.idGame) {
                res.type = GAME_COMMANDS.CREATE_GAME;
            }

            if (command === BASE_COMMANDS.ADD_SHIPS && !parsedData?.startGame?.start) {
                ws.send(JSON.stringify(res));
                console.log('here1');
            }
            if (command === GAME_COMMANDS.ATTACK) {
                ws.send(JSON.stringify(res));
            }
            
            if (command === BASE_COMMANDS.ADD_SHIPS && parsedData?.startGame?.start === MAX_PLAYERS) {
                const dataArr = JSON.parse(res.data); // here got IStartGame interfaced data where .lastAddShips need to send before start game
                const lastAddShips = {
                    gameId: dataArr?.lastAddShips?.gameId,
                    ships: dataArr?.lastAddShips?.ships,
                    indexPlayer: dataArr?.lastAddShips?.socketId,
                    socketId: dataArr?.lastAddShips?.socketId
                };

                const resArr = {
                    type: res.type,
                    data: JSON.stringify(lastAddShips),
                    id: req.id
                };

                ws.send(JSON.stringify(resArr));
                console.log('here2');

                res.type = GAME_COMMANDS.START_GAME;

                if (parsedData?.startGame?.currentPlayerIndex) {
                    turn = parsedData?.startGame?.currentPlayerIndex;
                }
            }
    
            if (res && !message && command !== GAME_COMMANDS.START_GAME && command !== ROOM_COMMANDS.UPDATE_ROOM && command !== BASE_COMMANDS.ADD_SHIPS) {
                console.log(`On command: "${ command }" result was sended successfully.`);
                ws.send(JSON.stringify(res));
                console.log('here3');
            }

            wsServer.clients.forEach((wsClient) => {
                if (res.type === ROOM_COMMANDS.UPDATE_ROOM) {
                    wsClient.send(JSON.stringify(res));
                    console.log('here4');
                }
                if (playersForStart && playersForStart.find((playerId: number) => playerId === ws.socketId) 
                    && res.type === GAME_COMMANDS.CREATE_GAME) { // create game for players that's ids in room
                    wsClient.send(JSON.stringify(res));
                    console.log('here5');
                }
                if (res.type === GAME_COMMANDS.START_GAME) {  // start game for players that's ids in room
                    const dataArr = JSON.parse(res.data);
                    
                    const dataRes = {
                        ships: dataArr?.startGame?.ships,
                        currentPlayerIndex: dataArr?.startGame?.currentPlayerIndex,
                        start: MAX_PLAYERS
                    };
                    const resArr = {
                        type: res.type,
                        data: JSON.stringify(dataRes),
                        id: req.id 
                    }
                    wsClient.send(JSON.stringify(resArr)); // here got IStartGame interfaced data where .startGame data for start
                    console.log('here6');

                    if (turn) {
                        const turnData = {
                            currentPlayer: turn,
                        };

                        const turnRes = {
                            type: "turn",
                            data: JSON.stringify(turnData),
                            id: turn
                        };

                        wsClient.send(JSON.stringify(turnRes));  // send turn for players that's ids in game
                        console.log('here7');
                    }
                }
            });
        }
    });

});

wsServer.on('close', () => console.log('The connection has been closed successfully.'));

wsServer.on('error', (err) => console.log(err.message));
