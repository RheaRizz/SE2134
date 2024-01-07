

const http = require('http');

const { Pool } = require('pg');

const fs = require('fs'); // read HTML file

const { URLSearchParams } = require('url'); 

const pool = new Pool({

  user: 'postgres',
  host: 'localhost',
  database: 'SE2134',
  password: '1234',
  port: 5433

});

async function handleRequest(request, response) {

  const url = request.url;
  const method = request.method;


if (url === '/apply-loan-success' && method === 'POST') {

  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();

  });

  request.on('end', async () => {
    
    try {
      const formData = new URLSearchParams(body);
      const name = formData.get('name');
      const email = formData.get('email');
      const loan_amount = formData.get('loan_amount');
      const reason = formData.get('reason');
      const status = formData.get('status');

      const insertQuery = `
        INSERT INTO loan (name, email, loan_amount, reason, status)
        VALUES ($1, $2, $3, $4, 'APPLIED')
        RETURNING id`;
      const values = [name, email, loan_amount, reason];

      try {
        const client = await pool.connect();
        try {
          const result = await client.query(insertQuery, values);
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(`Loan application submitted successfully. Your Loan ID is: ${result.rows[0].id}`);
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error executing SQL query:', error);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      }
    } catch (error) {
      console.error('Error parsing form data:', error);
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('Bad Request');
    }
  });
} else {
  fs.readFile('lab2-2.html', function (err, data) {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(data);
    }
  });
}



}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
  
});