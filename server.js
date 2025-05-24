const jsonServer = require('json-server')
const auth = require('json-server-auth')
const { cwd } = require('process')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const rules = auth.rewritter({
    users: 600,
    checkins: 640,
    checkouts: 640
})

server.use(middlewares)
server.use(rules)
server.use(rules)
server.use(auth)
server.use(router)

server.listen(3000, () => {
    console.log("Json Server rodando")
})


