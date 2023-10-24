

import { IncomingMessage, ServerResponse } from 'node:http';
import * as http from 'http';
import * as fs from 'fs';


async function handleRequest(request: IncomingMessage, _response: ServerResponse) {

   const url = request.url;
   const method = request.method;

   console.log('Debugging -- url is', url, 'while method is', method);

 const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
     if (req.url === '/apply-loan-success') {

         fs.readFile('lab2-2.html', (err: NodeJS.ErrnoException | null, data: Buffer) => {
             if (err) {
                 res.writeHead(500, { 'Content-Type': 'text/plain' });
                 res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }

         });

     } else {

         res.writeHead(200, { 'Content-Type': 'text/plain' });
         res.end(req.url || '');

     }
     
 });

 const PORT: number = 3000;

 server.listen(PORT, () => {
     console.log(`Server running at http://localhost:${PORT}`);
 });

 }



