const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
var serveStatic = require('serve-static') //serve static files
const { Pool, Client } = require('pg'); //database connection
const { query } = require('express');
require('dotenv').config() //buat env

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(serveStatic(path.join(__dirname,"/FE"))) //serve static files in FE Folder

/*
  parameterized query
  const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
  const values = ['brianc', 'brian.m.carlson@gmail.com']

  pool.query(text, values)
*/
app.get('/test', async (req, result) => {
  const pool = new Pool() //create DB connection from env
  
  pool.query('SELECT * FROM skintype', (err, res) => {
    if (err){
      throw err
    }
    console.log(res) //erase later
    result.json(res.rows)
  })
  await pool.end()
})

app.post('/recommend', async (req, res) => {
  if (req.body.umur<17){ //if umur <17
    res.json({"response-code":403,"message":"Forbidden"})
  } else {
    const values = [req.body.bahan]
    console.log(values)
    const querytext = 'SELECT * FROM bahan WHERE namabahan = $1'
    const pool = new Pool() //create a DB connection

    pool.query(querytext,values).then(result => {
      res.json(result.rows)
    }).catch(err =>{
      console.log(err)
      res.json({"response-code":500,"message":"Internal server error"})
    })
    await pool.end()
  }
})

app.get('/', async (req, res) => { //home page
  res.sendFile(path.join(__dirname,"/FE/index.html"));
});

port = process.env.PORT
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});