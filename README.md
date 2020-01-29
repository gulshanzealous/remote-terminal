This project uses React and websockets.

Deployed at "http://wooden-market.surge.sh/"

# Objective

To read logs from a webserver using websocket client

# Setup

Project can be setup in two ways: using docker and without docker.
Project needs port 3000 to run. Please close any other running apps at 3000.

## With docker

- ensure you have docker installed and run the following command

```console
	docker build .
	docker-compose up
```

- after the docker runs, the nginx server will open up the web app on port 3000

## Without docker

- ensure that you have node installed locally with version >= 12
- run the following commands

```console
	yarn
	yarn start
```

- the development server will open up the web app on port 3000

# App flow

- the app has only one page where it shows a container in which live logs are displayed

- a socket io client connects to the server which should be running at port 8080

- it initiates the communication by sending the start event after which the sever starts
  sending the logs

- These logs are displayed in the container. The latest log is shown at the top in green color.

- The logs are scrollable. After every 15 minutes, the logs are cleared except the most recent 5.
