import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"

const fetch = (...args) => 
  import('node-fetch')
  .then(({default: fetch}) => 
  fetch(...args))

const CLIENT_ID = '18b849ea0dd132f6729a'
const CLIENT_SECRET = '1aeb605845d2c68b85b4dc0011309fd53bdac83b'

const app = express()



app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

<<<<<<< HEAD
=======

mongoose.connect(process.env.DATABASE_URL)

//GITHUB ACCESS
app.get('/getAccessToken', async function (req,res) {
    req.query.code

    const params = '?client_id' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + req.query.code

    await fetch('https://github.com/login/oauth/access_token' + params, {
        method: "POST",
        header: {
            'Accept': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        res.json(data)
    })
})

//get USERDATA GITHUB
app.get ('/getUserData', async function (req,res) {
    req.get('Authorization')
    await fetch ('https://api.github.com/user', {
        method: 'GET',
        headers: {
            "Authorization" :req.get('Authorization') 
        }
    }).then((response) => {
        return response.json
    }).then ((data) => {
        console.log(data);
        res.json(data)
    })
})
>>>>>>> dev
