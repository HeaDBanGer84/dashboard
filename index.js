
const express = require('express')
const Docker = require('dockerode');
const Container = require('dockerode/lib/container');

let docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3000

app.use('/', express.static('public'))
app.use('/lib/trianglify.js', express.static('node_modules/trianglify/dist/trianglify.bundle.js'))

app.get('/config', (req, res) => {
    docker.listContainers(function (err, containers) {
        let resp = []
        if (containers) {
            containers.forEach(function (containerInfo) {
                let dashEnabled=new String(containerInfo.Labels["dash.enabled"]).toLowerCase();
                let composeService = containerInfo.Labels['com.docker.compose.service'];
                console.log(composeService+': '+dashEnabled);
                if(dashEnabled !== 'false') {

                    let extractedURL = containerInfo.Labels['traefik.http.routers.' + composeService + '.rule'];
                    let dashUrl = containerInfo.Labels['dash.url'] ?? '';
                    let group = containerInfo.Labels['com.docker.compose.project'] ?? undefined;

                    let name = containerInfo.Labels['dash.name'] ?? composeService;
                    let icon = containerInfo.Labels['dash.icon.fa'] ?? "fas fa-globe";
                    let color = containerInfo.Labels['dash.icon.color'] ?? "#111111";

                    let url = '';
                    if (dashUrl != '') {
                        url = dashUrl;
                    } else {
                        const regex = /^Host\(\`(.*)\`\)/gm;
                        let match = regex.exec(extractedURL)
                        if (match) {
                            url = "http://" + match[1]
                        }
                    }

                    if (url != '') {
                        resp.push({
                            "alt": name,
                            "icon": icon,
                            "color": color,
                            "link": url,
                            "group": group 
                            //"containerInfo": containerInfo,
                        })
                    }
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