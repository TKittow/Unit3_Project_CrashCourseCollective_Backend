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

// app.use(cors())
app.use(cors({ origin: '*' }))

app.use(bodyParser.json())

const port = process.env.PORT || 4000
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET 


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

mongoose.connect(process.env.DATABASE_URL)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    collaborators: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
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
const Project = mongoose.model("Project", projectSchema)


app.post("/users/new", async (req, res) => {
    const now = new Date()
    console.log("Request body:", req.body);

    if ( await User.countDocuments({"username": req.body.username}) === 0 ) {
        const newUser = new User({
            username: req.body.username,
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
        try {
            await User.findOneAndUpdate(
                {"username": req.body.username}, 
                {lastLogin: now}
                )
                res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
})

app.get("/", (req, res) => {
    res.json({message: "Server running"})
})

app.get('/projects', async (req, res) => {
    try{
        const allProjects = await Project.find({})
        res.json(allProjects)
    }
    catch (err){
        console.error(err)
    }
})

//Posting a new project
app.post('/project/add', async (req, res) => {
    const project = req.body
    const newProject = new Project({
        projectName: project.projectName,
        //Change Username field to currently logged in
        username: project.username,
        collaborators: project.collaborators1,
        description: project.description,
        deploymentLink: project.deploymentLink
    })

    await newProject.save()
    .then(() => {
        console.log(`${project.projectName} was added to the database`)
    res.sendStatus(200)
    })
    .catch(error => console.error(error))
})

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
