const PORT = 50002;
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "db.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{"info": []}', "utf8");


const express = require('express');
const jsonServer = require("json-server");
const { strictEqual } = require("assert/strict");
const app = express();
const router = jsonServer.router(path.join(__dirname, "data/db.json"));
const middlewares = jsonServer.defaults({ logger: false });
const db = router.db;


// Define routes BEFORE middlewares to take precedence over static file serving
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/index.html", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Serve static files from the root directory and 'js' subfolder using express.static
app.use(express.static(__dirname));
// app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(router);
app.listen(PORT, () => {
    const text = `JSON server is running on port: ${PORT}`;
    console.log(text);
});


// http://localhost:50002/logs?type=button