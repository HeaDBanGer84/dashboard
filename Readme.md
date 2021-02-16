Run Dashboard

Add to your `/etc/hosts`

```
127.0.0.1       whoami.docker.localhost dash.docker.localhost
```

Testing with docker-compose:

```
docker-compose -f "docker-compose.yml" up -d --build
```

Visit <http://dash.docker.localhost/> in your Browser