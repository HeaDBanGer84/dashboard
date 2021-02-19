
const express = require('express')
const Docker = require('dockerode');
const Container = require('dockerode/lib/container');

let docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3000

app.use('/', express.static('public'))

app.get('/config', (req, res) => {
    docker.listContainers(function (err, containers) {
        let resp = []
        if (containers) {
            containers.forEach(function (containerInfo) {
                if (String.prototype.toLocaleLowerCase(containerInfo.Labels['dash.enabled']) !== 'false') {

                    let composeService = containerInfo.Labels['com.docker.compose.service'];
                    let extractedURL = containerInfo.Labels['traefik.http.routers.' + composeService + '.rule'];
                    let dashUrl = containerInfo.Labels['dash.url'];
                    let dashName=containerInfo.Labels['dash.name'];
                    let icon = containerInfo.Labels['dash.icon.fa'] ?? "fas fa-globe";
                    let color = containerInfo.Labels['dash.icon.color'] ?? "#111111";
                    let name = dashName ?? composeService
                    let url='';

                    if(dashUrl){
                        url=dashUrl;
                    }else{
                        const regex = /^Host\(\`(.*)\`\)/gm;
                        let match = regex.exec(extractedURL)
                        if (match) {
                            url="http://" +  match[1]
                        }
                    }

                    resp.push({
                        "alt": name,
                        "icon": icon,
                        "color": color,
                        "link": url
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