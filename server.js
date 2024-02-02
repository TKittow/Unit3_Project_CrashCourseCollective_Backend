import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"


const fetch = (...args) => 
  import('node-fetch')
  .then(({default: fetch}) => 
  fetch(...args))



const app = express()


app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET 


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})


mongoose.connect(process.env.DATABASE_URL)

//GITHUB ACCESS
app.get('/getAccessToken', async function (req,res) {
    req.query.code

    const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;
    try{
        await fetch('https://github.com/login/oauth/access_token' + params, {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((data) => {
            res.json(data)
        })
    } catch (e) {
        console.error(e);
}
console.log(params);
})

//get USERDATA GITHUB
app.get ('/getUserData', async function (req, res) {
    req.get('Authorization')
    await fetch ('https://api.github.com/user', {
        method: 'GET',
        headers: {
            "Authorization" : req.get('Authorization') 
        }
    }).then((response) => {
        return response.json()
    }).then ((data) => {
        console.log(data);
        res.json(data)
    })
})