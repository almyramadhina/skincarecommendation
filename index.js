const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
var serveStatic = require('serve-static') //serve static files
const { Pool, Client } = require('pg'); //database connection
const { query } = require('express');
const { read } = require('fs');
require('dotenv').config() //buat env

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(serveStatic(path.join(__dirname,"/FE"))) //serve static files in FE Folder

app.post('/recommend', async (req, res) => {
  if (req.body.umur<17){ //if umur <17
    res.json({"response-code":403,"message":"Forbidden"})
  } else {
    var querytext, values
    if (!req.body.alergi1){ //tidak ada alergi
      querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp\n\
      WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
      (SELECT id_profil FROM profile p\n\
      INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
      INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
      WHERE sp.skinprob=$4 AND st.skintype=$5)'
      values=[req.body.hargabawah, req.body.hargaatas, req.body.kategori, req.body.skinprob, req.body.skintype]
    } else {
      if (!req.body.alergi2){ //ada 1 alergi
        querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp, produk_bahan pb\n\
        WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
        (SELECT id_profil FROM profile p\n\
        INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
        INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
        WHERE sp.skinprob=$4 AND st.skintype=$5) AND\n\
        p.id_produk = pb.id_produk AND pb.id_produk NOT IN\n\
        (SELECT pb.id_produk FROM bahan b, produk_bahan pb\n\
        WHERE namabahan = $6 AND b.id_bahan = pb.id_bahan)'
        values=[req.body.hargabawah, req.body.hargaatas, req.body.kategori, req.body.skinprob, req.body.skintype, req.body.alergi1]
      } else { //ada 2 alergi
        querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp, produk_bahan pb\n\
        WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
        (SELECT id_profil FROM profile p\n\
        INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
        INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
        WHERE sp.skinprob=$4 AND st.skintype=$5) AND\n\
        p.id_produk = pb.id_produk AND pb.id_produk NOT IN\n\
        (SELECT pb.id_produk FROM bahan b, produk_bahan pb\n\
        WHERE (namabahan = $6 OR namabahan = $7) AND b.id_bahan = pb.id_bahan)'
        values=[req.body.hargabawah, req.body.hargaatas, req.body.kategori, req.body.skinprob, req.body.skintype, req.body.alergi1, req.body.alergi2]
      }
    }

    const pool = new Pool() //create a DB connection

    await pool.query(querytext,values).then(result => {
      res.json({"response-code":200,"message":"OK", "data":result.rows})
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
  console.log(`App listening on port ${port}!`)
});