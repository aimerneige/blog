---
title: "Docker Basic Notes"
date: 2023-03-13T20:31:37+08:00
draft: false
ShowToc: true
categories: [DevOps]
tags: [docker,note]
cover:
    image: "images/docker-cover.png"
    alt: "Docker"
    relative: false
---

> This post is just a simple note.
>
> More detail in this video: <https://www.youtube.com/watch?v=3c-iBn73dDE>

## **Difference Image and Container**

- CONTAINER is a running environment for IMAGE
  - virtual file system
  - port blinded: talk to application running inside of container
  - application image: postgres, redis, mongo, ...
- redis in dockerhub are images

```bash
docker pull postgres
docker pull redis
```

```bash
# lists installed images
docker images
```

```bash
docker run redis
# `-d` means running in detached mode
docker run -d redis
```

```bash
# lists running container
docker ps
# lists running and stopped container
docker ps -a
```

```bash
# stops the container
docker stop <CONTAINER ID>
# start the container
docker start <CONTAINER ID>
```

```bash
# pulls image and starts container
docker run redis:4.0
```

## **CONTAINER Ports vs HOST ports**

- Multiple containers can run on your host machine
- Your laptop has only certain ports available
- Conflict when same port on host machine

| host      | docker    |
| --------- | --------- |
| Port 5000 | Port 5000 |
| Port 3000 | Port 3000 |
| Port 3001 | Port 3000 |

```bash
docker run -p6000:6379 redis
```

```bash
docker logs <CONTAINER ID>
```

```bash
docker logs <CONTAINER NAMES>
```

```bash
docker run -d -p6000:6379 --name redis-older redis:4.0
```

```bash
# it Interactive Terminal
docker exec -it <CONTAINER ID> /bin/bash
docker exec -it <CONTAINER NAMES> /bin/bash
# if no bash installed
docker exec -it <CONTAINER ID> /bin/sh
docker exec -it <CONTAINER NAMES> /bin/sh
```

```bash
# create a new container from a image
docker run
# start a exist container
docker start
```

```bash
docker pull mongo
docker pull mongo-express
```

```bash
docker network ls
```

```bash
docker network create <NETWORK NAME>
```

```bash
docker run -d \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=password \
    --network mongo-network \
    --name mongodb \
    mongo
```

```bash
docker run -d \
    -p 8081:8081 \
    -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
    -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
    -e ME_CONFIG_MONGODB_PORT=27017 \
    -e ME_CONFIG_MONGODB_SERVER=mongodb \
    --net mongo-network \
    --name mongo-express \
    mongo-express
```

```bash
docker logs <CONTAINER ID> -f
docker logs <CONTAINER ID> | tail
docker logs <CONTAINER ID> | more
```

## **Docker Compose**

docker run command

```bash
docker run -d \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=password \
    --network mongo-network \
    --name mongodb \
    mongo

docker run -d \
    -p 8081:8081 \
    -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
    -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
    -e ME_CONFIG_MONGODB_PORT=27017 \
    -e ME_CONFIG_MONGODB_SERVER=mongodb \
    --net mongo-network \
    --name mongo-express \
    mongo-express
```

mongo-docker-compose.yaml

```yaml
version: '3'
services:
  mongodb:
    image: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
  mongo-express:
    image: mongo-express
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=password
      - ME_CONFIG_MONGODB_PORT=27017
      - ME_CONFIG_MONGODB_SERVER=mongodb
```

*Docker Compose takes care of creating a common Network!*

```bash
docker-compose -f mongo-docker-compose.yaml up
docker-compose -f mongo-docker-compose.yaml up -d
docker-compose -f mongo-docker-compose.yaml down
```

## **Dockerfile**

- Blueprint for building images

`Image Environment Blueprint`

```bash
install node

set MONGO_DB_USERNAME = admin
set MONGO_DB_PASSWORD = password

create /home/app folder

copy current folder files to /home/app

start the app with: "node server.js"
```

`DOCKERFILE`

```dockerfile
FROM node

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=password

RUN mkdir -p /home/app

COPY ./app /home/app

CMD [ "node", "/home/app/server.js" ]
```

- FROM: Start by basing it on another image
- ENV: Optionally define environment variables
- RUN: execute any Linux command
- COPY: executes on the HOST machine
- CMD: entry point command

The name must be "Dockerfile"

```bash
docker build -t my-app:1.0 .
```

```bash
# DELETE A IMAGE
docker rmi <IMAGE ID>
```

```bash
# DELETE A CONTAINER
docker rm <CONTAINER ID>
```

```bash
docker pull mongo:4.2
docler pull docker.io/library/mongo:4.2
```

```bash
docker tag my-app:1.0 327587328957.dkr.ecr.eu-central-1.amazonaws.com/my-app:1.0
```

```bash
docker push 327587328957.dkr.ecr.eu-central-1.amazonaws.com/my-app:1.0
```

## **Docker Volumes**

Container use virtual file system. When you stop or restart the container, all the data is GONE!

Folder in physical host file system is **mounted** into the virtual file system of Docker.

### *Host Volumes*

```bash
docker run \
    -v /home/mount/data:/var/lib/mysql/data
```

You decide **where on the host file system** the reference is made.

### *Anonymous Volumes*

```bash
docker run \
    -v /var/lib/mysql/data
```

for **each container a foldre is generated** that gets mounted.

Automatically created by Docker

### *Named Volumes*

```bash
docker run \
    -v name:/var/lib/mysql/data
```

you can **reference** the volume **by name**

should be used in production

## **Docker Volumes in docker-compose**

```yaml
version: '3'
services:
  mongodb:
    image: mongo
      ports:
        - 27017:27017
      volumes:
        - db-data:/var/lib/mysql/data
  mongo-express:
    ...
volumes:
  db-data:
    driver: local
```


```yaml
version: '3'
services:
  mongodb:
    image: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo-data:/data/db
      - mysql-data:/var/lib/mysql
      - postgres-data:/var/lib/postgresql/data
  mongo-express:
    image: mongo-express
    ports:
      - 8080:8081
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=password
      - ME_CONFIG_MONGODB_PORT=27017
      - ME_CONFIG_MONGODB_SERVER=mongodb
volumes:
  mongo-data:
    driver: local
  mysql-data:
    driver: local
  postgres-data:
    driver: local
```

## **Docker Volume Locations**

- Windows: `C:\ProgramData\docker\volumes`
- Linux: `/var/lib/docker/volumes`
- OS X: `/var/lib/docker/volumes`

Docker for Mac creates a Linux virtual machine and stores all the Docker data here.
