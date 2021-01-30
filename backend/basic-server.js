// server.js
import { createServer } from 'http';
const server = createServer((req, res) => {
  res.end('This is my first response');
});
server.listen(process.env.PORT || 4200);

