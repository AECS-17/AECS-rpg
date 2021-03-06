// This file is released under the MIT License. See the LICENSE file.

import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import { entryPoint } from '@rpgjs/server'
import RPG from './rpg'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    maxHttpBufferSize: 1e4
})
const rpgGame = entryPoint(RPG, io)
rpgGame.app = app // Useful for plugins (monitoring, backend, etc.)

app.use('/', express.static(__dirname + '/../client'))

server.listen(PORT, () =>  {
    rpgGame.start()
    console.log(`
        ===> MMORPG is running on http://localhost:${PORT} <===
    `)
})
