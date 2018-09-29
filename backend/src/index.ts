import * as admin from 'firebase-admin'
const serviceAccount = require('./config.json')
admin.initializeApp(serviceAccount)
import * as express from 'express'
import * as crypto from 'crypto-js'
import * as JWT from 'jsonwebtoken'
import * as HTTP from 'http'
import * as SocketIO from 'socket.io'
import * as Request from 'request'
import * as BodyParser from 'body-parser' 
const app: express.Express = express()
const server : HTTP.Server = HTTP.createServer(app)
const io: SocketIO.Server = SocketIO(server)
const db: FirebaseFirestore.Firestore = admin.firestore()
const dbUsers: FirebaseFirestore.CollectionReference = db.collection('users')
const SHA256: Function = crypto.SHA256
const JWT_SECRET_KEY: string = "c@AuR=brjF3$jHm=4HY7u!j3SgwgcNkcVyV8F2&nuSp+&gW7R^bV+=%s6394Rh^u*g!5eE88H&H*H9TeHhDsA?K!35m!@&v2uNXzV*vz^92VuZL6tE&v9Ab9Agc_QHNF"
const ANNONYMYOUS_TIMEOUT = 15 * 1000
const users: Map<String, SocketIO.Socket> = new Map<String, SocketIO.Socket>()
const devices: Map<String, SocketIO.Socket> = new Map<String, SocketIO.Socket>()

function getTokenFromRequest(request: any): string {
    return request.token
}

function getUserFromDB(email: string): FirebaseFirestore.DocumentReference {
    return dbUsers.doc(email)
}

function errorInJSON(err) {
    return {code: 4, message: "Something wrong happend: 0x01 CATCH: " + ("" + err)}
}

function invalidAuthInJSON() {
    return {code: 5, message: "Invalid email / password"}
}

function needDataInJSON() {
    return {
        code: 1,
        message: "We need more information to register you"
    }
}

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended: false}))

app.use((request, response, next) => {
    // Setup the HTTP Headers
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
        return response.status(200).json({})
    }
    // Allow access to who want to auth himself
    const originalUrl: string = request.originalUrl
    if (originalUrl.startsWith('/api/auth') || originalUrl.startsWith('/api/test')) {
        next()
        return
    }
    // Check if he is authticated to know who is he
    if (request.headers && request.headers.authorization && request.headers.authorization.startsWith('JWT ')) {
        const token: string = request.headers.authorization.split(' ')[1]
        const req: any = request
        req.token = token
        let payload: any = undefined
        try {
            payload = JWT.verify(token, JWT_SECRET_KEY)
        } catch (e) { 
            payload = undefined
        }
        // Reject anyone who doesn't enter the correct token
        if (payload === undefined) {
            return response.send(JSON.stringify({
                code: 2,
                message: "You need to tell us who are you"
            }))
        }
        req.email = payload.email
        return next()
    }
    // Reject anyone who doesn't have permission to visit other routes
    return response.send(JSON.stringify({
        code: 2,
        message: "You need to tell us who are you"
    }))
})

app.get('/api/test', (request, response) => {
    const token = getTokenFromRequest(request)
    const a: number = 5 * Math.random()
    let code: number = 0
    if (a >= 2.5) {
        code = 1
    } else {
        code = 0
    }
    response.send({code: code, token: token})
})

app.post('/api/auth/login', (request, response) => {
    const email: string = request.body.email
    const password: string = "" + SHA256(request.body.password)
    if (email === undefined && password === undefined) {
        return response.send(needDataInJSON()) 
    }
    const dbDocument: FirebaseFirestore.DocumentReference = getUserFromDB(email)
    dbDocument.get().then((doc: FirebaseFirestore.DocumentSnapshot) => {
        if (!doc.exists) {
            return response.send(invalidAuthInJSON())
        }
        const data: FirebaseFirestore.DocumentData = doc.data()
        if (data.password === password) {
            const token: string = JWT.sign({
                name: data.name,
                email: email
            }, JWT_SECRET_KEY)
            return response.send(JSON.stringify({
                code: 0,
                message: "You are loggined in",
                data: {
                    token: token,
                    name: data.name
                }
            }))
        } else {
            return response.send(invalidAuthInJSON())
        }
    })
    return undefined
})

app.post('/api/auth/register', (request, response) => {
    const name: string = request.body.name
    const email: string = request.body.email
    const password: string = "" + SHA256(request.body.password)
    if (email === undefined && password === undefined && name === undefined) {
        return response.send(needDataInJSON())
    }
    const dbDocument: FirebaseFirestore.DocumentReference = getUserFromDB(email)
    dbDocument.get().then((snapshot: FirebaseFirestore.DocumentSnapshot) => {
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
        if (snapshot.exists) {
            return response.send(JSON.stringify({
                code: 2,
                message: "You are already registered"
            }))
        }
        dbDocument.set({
            did: "UNKNOWN",
            fid: "UNKNOWN",
            name: name,
            password: password
        }).then(() => {
            return response.send(JSON.stringify({
                code: 0,
                message: "Successfully registered a user for you"
            }))
        }).catch(err => {
            console.error(err)
            return response.send(errorInJSON(err))
        })
        return undefined
    }).catch(err => {
        return response.send(errorInJSON(err))
    })
    return undefined
})

app.post('/api/user/fid', (request, response) => {
    const req: any = request
    const fid: any = "" + SHA256(request.body.fid)
    if (fid === undefined) {
        return response.send(needDataInJSON())
    }
    const dbDocument: FirebaseFirestore.DocumentReference = getUserFromDB(req.email)
        dbDocument.get().then(() => {
            dbDocument.update({
                fid: fid
            }).then(() => {
                return response.send({
                    code: 0,
                    message: "Successfully set the fid"
                })
            }).catch(err => {
                return response.send(errorInJSON(err))
            })
        }).catch(err => {
            return response.send(errorInJSON(err))
        })
    return undefined
})

app.post('/api/user/did', (request, response) => {
    const req: any = request
    const did: any = "" + SHA256(request.body.did)
    if (did === undefined) {
        return response.send(needDataInJSON())
    }
    const dbDocument: FirebaseFirestore.DocumentReference = getUserFromDB(req.email)
        dbDocument.get().then(() => {
            dbDocument.update({
                did: did
            }).then(() => {
                return response.send({
                    code: 0,
                    message: "Successfully set the did"
                })
            }).catch(err => {
                return response.send(errorInJSON(err))
            })
        }).catch(err => {
            return response.send(errorInJSON(err))
        })
    return undefined
})

app.post('/api/user', (request, response) => {
    const fid = "" + SHA256(request.body.fid)
    if (fid === undefined) {
        return response.send(needDataInJSON())
    }
    dbUsers.where('fid', '==', fid).get().then((snapshot: FirebaseFirestore.QuerySnapshot) => {
        const docs: FirebaseFirestore.QueryDocumentSnapshot[] = snapshot.docs
        if (docs.length <= 0) {
            return response.send({
                code: 0,
                data: {
                    found: false
                },
                message: "Failed to find the user by this FID"
            })
        }
        return response.send({
            code: 0,
            data: {
                found: true,
                email: docs[0].id
            },
            message: "Successfully found the user by his/her FID"
        })
    })
    return undefined
})

app.get('/api/request', (request, response) => {
    io.sockets.emit('request', {
        position: Math.floor(Math.random() * 2050),
        name: 'Hamza',
        type: 'info',
        status: 'Waiting',
        info: 'Hamza',
        datetime: ("" + Date.now())
    })
})

io.on('connection', (socket: SocketIO.Socket) => {
    socket.on('who', (data) => {
        const s: any = socket
        const type: number = parseInt(data.type)
        // Check which type is if 0 then it will be device if 1 then it will be user
        s.type = type
        if (type === 0) {
            socket.emit('DID') 
        } else if (type === 1) {
            socket.emit('auth')
        } else {
            return socket.disconnect(true)
        }
        return undefined
    })

    socket.on('timeout', (data) => {
        data.status = "Rejected"
        data.info = "Login timeout by " + data.info
        socket.emit('history', data)
    })

    socket.on('reject', (data) => {
        data.status = "Rejected"
        socket.emit('history', data)
    })

    socket.on('accept', (data) => {
        data.status = "Accepted"
        socket.emit('history', data)
    })

    // User Channels Section

    socket.on('auth', (token) => {
        const s: any = socket
        let payload: any | undefined = undefined
        try {
            payload = JWT.verify(token, JWT_SECRET_KEY)
        } catch (e) {
            payload = undefined
        }
        if (payload === undefined) {
            return socket.disconnect(true)
        }
        const email: string = payload.email
        const name: string = payload.name
        socket.emit('load', {
            name: name,
            email: email
        })
        s.token = token
        return undefined
    })

    socket.on('fid', (fid) => {
        const s: any = socket
        s.fid = "" + SHA256(fid)
        users.set(fid, socket)
    })

    socket.on('verify', (did) => {
        const device: SocketIO.Socket = devices.get(did)
        device.emit('verify', did)
        const d: any = device
        d.timeoutid = undefined
    })

    // Device Channels Section

    socket.on('DID', (DID) => {
        const s: any = socket
        s.DID = DID
        devices.set(DID, socket)
    })

    socket.on('request', (data) => {
        const s: any = socket
        const type: number = data.type
        // Not Found Annonymous
        if (type === 0) {
            const fid: string = "" + SHA256(data.fid)
            Request.post("http://localhost:2030/api/user", {
                headers: {
                    "authorization": s.token
                },
                body: {
                    fid: fid
                }
            }, (error, response, body) => {
                if (error) {
                    return console.error(error)
                }
                const $body: any = JSON.parse(body)
                const code: number = parseInt($body.code)
                if (code === 0) {
                    const found: boolean = $body.data.found
                    if (found) {
                        const user: SocketIO.Socket = users.get(fid)
                        if (user === undefined) {
                            return
                        }
                        s.timeoutid = setTimeout(() => {
                            if (s.timeoutid === undefined) return
                            s.emit('verify', -1)
                        }, ANNONYMYOUS_TIMEOUT)
                        user.emit('verify', s.did)
                    }
                }
            })
        }
    })

    socket.emit('connect')
})

server.listen(80, () => {
    console.log('[HTTP] Listening on http://localhost:80 | tcp://localhost:80')
})
