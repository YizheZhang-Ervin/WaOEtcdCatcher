const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan');
const handler = require("./handler")
const path = require("path")
const http = require("http")
const configJson = require("../app.json")
require("./websocket.js")

// log
app.use(logger("dev"));

// 响应处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept")
    next()
});

// 静态文件
app.use(express.static(path.join(__dirname, '../client')));

// 路由
app.route("/check").get(handler.check)
app.route("/callEtcd").post(handler.callEtcd)

// web服务
server = http.createServer(app);
const port = configJson["port"] || '3000'
server.listen(port);
server.on('error', (err) => {
    throw err
});
server.on('listening', () => {
    console.log(`Express Started! Listening on Port: ${port}`)
});