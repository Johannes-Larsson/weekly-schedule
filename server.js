#!/usr/bin/env  node

const express = require('express');
const sch = require('./schedule.js');
const sqlite3 = require('sqlite3');
const config = require('./config.json');
const language = require('./language.json');
const bodyParser = require('body-parser');

var db = new sqlite3.Database('schema.db');
var app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./static'));

db.serialize(function() {
  db.run('create table if not exists schedule ("day" integer, "person" text)');
  db.get('select count(*) as count from schedule', function(err, res) {
    if (res.count == 0) {
      for (var i = 0; i < 7; i++) {
        db.run('insert into schedule ("day", "person") values (' + i + ', "not set")');
      }
    }
  });
});

app.get('/', function (req, res) {
  sch.getTodaysData(db, function (data) {
    res.render('index', { person: data, message: config.message, title: config.title });
  });
});

app.get('/admin', function (req, res) {
  sch.getData(db, function (data) {
    res.render('admin', { sch: data, days: language.days, header: language.day, requirePass: config.requirePass, title: config.title });
  })
});

app.post('/update', function (req, res) {
  console.log(JSON.stringify(req.body));
  var person = req.body.person;
  var day = req.body.day;
  var pass = req.body.password;

  if (pass == config.adminPass || !config.requirePass) {
    console.log('udpating: person = ' + person + ', day: ' + day);
    db.run('update schedule set person = ? where day = ?', person, day);
    res.status(200).end();
  } else {
    console.log('someone tried to update with the wrong password! pass = ' + pass);
    res.status(401).end();
  }
});

app.listen(config.port, function () {
	console.log('listening on ' + config.port);
});
