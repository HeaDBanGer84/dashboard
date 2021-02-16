
const express = require('express')
const Docker = require('dockerode');
const Container = require('dockerode/lib/container');

let docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3000

app.use('/', express.static('public'))

app.get('/config', (req, res) => {
    console.log(req.url)
    docker.listContainers(function (err, containers) {
        let resp = []
        if (containers) {
            containers.forEach(function (containerInfo) {
                //console.log(containerInfo.Id)
                let composeService = containerInfo.Labels['com.docker.compose.service'];
                let extractedURL = containerInfo.Labels['traefik.http.routers.' + composeService + '.rule'];
                const regex = /^Host\(\`(.*)\`\)/gm;

                let match = regex.exec(extractedURL)
                if (match) {
                    extractedURL = match[1]
                    let icon=containerInfo.Labels['dash.icon.fa'] ?? "fas fa-globe";
                    let color=containerInfo.Labels['dash.icon.color'] ?? "#111111";

                    resp.push({
                        "alt": composeService,
                        "icon": icon,
                        "color": color,
                        "link": "http://" + extractedURL
                        //"containerInfo": containerInfo,
                    })
                }
                
            });
        }
        res.json({
            title: "dashboard",
            items: resp
        });
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})