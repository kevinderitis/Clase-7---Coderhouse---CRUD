import express from 'express';
import UserManager from './src/UserManager.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const users = [];

const manager = new UserManager() // utilizar async await 

const getNextId = () => {
    let id = 1;
    if(users.length > 0){
        id = users.length + 1;
    }
    return id;
}

app.get('/api/user', (req, res) => {
    res.send(users)
})

app.post('/api/user', (req, res) => {
    let user = req.body;
    if(!user.name || !user.lastname){
        res.status(400).send({status: "error", error: "Invalid parameters"})
    }
    user.id = getNextId()
    users.push(user)
    res.send({ status: "success", payload: user})
})

app.put('/api/user/:id', (req, res) => {
    let id = req.params.id;
    let user = req.body;
    let index = users.findIndex(usr => usr.id == id)
    if(index === -1){
        res.status(400).send({ status: "error", error: "user not found"})
    }
    users[index] = user;
    res.send({ status: "success", payload: user, msg: `User with id: ${id} updated`})
    
})

app.delete('/api/user/:id', (req, res) => {
    let id = req.params.id;
    if(!id){
        res.status(400).send({status: "error", error: "Not id"})
    }

    let usersUpdated = users.filter(user => user.id !== id)
    users = usersUpdated;
    res.send({ status: "success", msg: "User deleted" })
})

const PORT = 8080;
const server = app.listen(PORT, () => console.log(`Server running on port: ${server.address().port}`))
server.on('error', error => console.log(error))