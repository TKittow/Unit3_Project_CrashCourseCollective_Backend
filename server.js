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

mongoose.connect(process.env.DATABASE_URL)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    cohort: {
        type: Number,
        required: false
    },
    linkedIn: {
        type: String,
        required: false
    },
    lastLogin: {
        type: Date, 
        required: true
    }
})

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    username: {
        // This needs to be pulled from the User database
        type: String,
        required: true
    },
    collaborators: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deploymentLink: {
        type: String,
        required: true
    },
})

const User = mongoose.model("User", userSchema)

app.post("/user/login", async (req, res) => {
    const now = new Date()

    if ( await User.countDocuments({"userEmail": req.body.userEmail}) === 0 ) {
        const newUser = new User({
            username: req.body.username,
            userEmail: req.body.userEmail,
            cohort: req.body.cohort,
            linkedIn: req.body.linkedIn,
            lastLogin: now
        })
        newUser.save()
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => {
            res.sendStatus(500)
        })
    } else {
        await User.findOneAndUpdate(
            {"userEmail": req.body.userEmail}, 
            {cohort: req.body.cohort},
            {linkedIn: req.body.linkedIn},
            {lastLogin: now})
        res.sendStatus(200)
    }
})

app.get("/", (req, res) => {
    res.json({message: "Server running"})
})

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
