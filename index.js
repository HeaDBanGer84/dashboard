
const express = require('express')
const Docker = require('dockerode');
const Container = require('dockerode/lib/container');

let docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log(req.url)
    docker.listContainers(function (err, containers) {
        let resp = []
        if (containers) {
            containers.forEach(function (containerInfo) {
                console.log(containerInfo.Id)
                let composeService = containerInfo.Labels['com.docker.compose.service'];
                resp.push({
                    //"containerInfo": containerInfo,
                    "name": composeService,
                    "url": containerInfo.Labels['traefik.http.routers.' + composeService + '.rule']
                })
            });
        }
        res.json(resp);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})