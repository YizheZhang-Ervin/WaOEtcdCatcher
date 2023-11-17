const axios = require("axios")
const fs = require("fs")
const https = require("https")
const configJson = require("../app.json")

const agent = new https.Agent({
    ca: fs.readFileSync(configJson["ca"]),
    key: fs.readFileSync(configJson["key"]),
    cert: fs.readFileSync(configJson["cert"])
});
const axiosInstance = axios.create({
    httpsAgent: agent,
    baseURL: configJson["baseUrl"],
    timeout: configJson["timeout"]
});

exports.check = (req, res) => {
    res.status(200);
    res.json({
        result: JSON.stringify("200 OK")
    });
};

exports.callEtcd = (req, res) => {
    const reqBody = req.body
    axiosInstance.request({
        method: reqBody["method"],
        url: reqBody["url"],
        params: reqBody["params"],
        data: reqBody["data"]
    }).then(res2 => {
        res.status(200);
        res.json(res2.data)
    }).catch(err => {
        console.log(err)
        res.status(500);
        res.json(err)
    })
}