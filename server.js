const n_port = 50002;
const path = require('path');
var fs = require('fs');


var express = require('express');


var app = express();
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});
app.use(express.json());


app.use(express.static(__dirname));

app.get('/', function(req, res) {
	//res.sendFile(path.join('index.html'));
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ver',(req,res)=>{
	res.json({"version": '1.0.0'});
})


const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "db.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{"info": []}', "utf8");

const jsonServer = require('json-server');
const server = jsonServer.create();
var router = jsonServer.router(path.join('data/db.json'));
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);

// server.listen(n_port, () => {
// 	console.log('JSON Server is running at: ' + n_port.toString());
// })
app.use('/json', server.use(router));
app.listen(n_port, () => {
    console.log('JSON Server is running at: ' + n_port.toString());
})
