import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import dotenv from 'dotenv';
import { HOSTNAME } from '../constants';
import { WebSocketServer } from 'ws';
import { Router } from './router';

dotenv.config();
const port = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000;

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

wsServer.on('connection', function connection(ws, req) {

    ws.on('error', (err) => {
        console.error(err.message);
    });

    ws.on('message', function message(chunk) {
        const req = JSON.parse(chunk.toString())
        
        const command = req.type || 'unknown';

        const res = Router.route(command);

        if(res) {
            ws.send(JSON.stringify(res))
        }
    });

});
