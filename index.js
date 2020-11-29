const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
var serveStatic = require('serve-static')

require('dotenv').config()

app.use(serveStatic(path.join(__dirname,'FE')))

/*connectDB = ({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME
});

var pgp = require('pg-promise')();
const CONNECT_DB = 'postgres://' + connectDB.user + ':' + connectDB.pass + '@' + connectDB.host + ':' + connectDB.port + '/' + connectDB.name; 
var dbPromise = pgp(CONNECT_DB); 
*/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"/index.html"));
});

port = process.env.PORT
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});