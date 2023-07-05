import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import dotenv from 'dotenv';
import { HOSTNAME } from '../constants';

dotenv.config();
const port = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 8181;

export const httpServer = http.createServer(function (req, res) {
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
