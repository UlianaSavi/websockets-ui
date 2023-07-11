# RSSchool NodeJS websocket task template
> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 8080 port.

## Installation
1. Clone/download repo
2. `npm install`
3. use description in PR for cross-check

## Usage
**Default**

`npm run start`

* App served @ `http://localhost:8181` without nodemon

**Development**

`npm run start:dev`

* App served @ `http://localhost:8181` with nodemon



**Production**

`npm run start:prod`

* App served @ `http://localhost:8181` do build app && run with nodemon

---

**All commands**

Command | Description
--- | ---
`npm run start` | App served @ `http://localhost:8181` without nodemon
`npm run start:dev` | App served @ `http://localhost:8181` with nodemon
`npm run start:prod` | App served @ `http://localhost:8181` with nodemon

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
