import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import dotenv from 'dotenv';
import { HOSTNAME } from '../constants';
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
        const req = JSON.parse(chunk.toString())

        let reqData = req.data || {};
        const command = req.type || 'unknown';

        const addWs = {socketId: ws.socketId}
        reqData = JSON.stringify({...reqData, ...addWs}); // add socket id to request data for identify player

        const data = Router.route(command, JSON.stringify(reqData));
        const res = {
            type: command !== 'create_room' ? command : 'update_room',
            data: data,
            id: req.id,
        };

        if (res) {
            console.log(`On command: "${ command }" result was sended successfully.`);
            ws.send(JSON.stringify(res))
        }
    });

});

wsServer.on('close', () => console.log('The connection has been closed successfully.'));

wsServer.on('error', (err) => console.log(err.message));
