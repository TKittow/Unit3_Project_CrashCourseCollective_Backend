# ReadMe Crash Course Collective

![CCC](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20Final%20Product.png)

### Description

As a group project we decided to create a website where a user can upload projects using the GitHub Login API. A user (once signed in) will be able to post a project on the website. We then added a ‘collaborators’ functionality to link users to your projects. We had a week to work on this together.

### Links
[Github Frontend](https://github.com/TKittow/Unit3_Project_CrashCourseCollective_Frontend)
[Github Backend](https://github.com/TKittow/Unit3_Project_CrashCourseCollective_Backend)

[Deployment Link](https://crashcoursecollective.netlify.app/)


### Timeframe & Working Team (Solo/Pair/Group)

I worked on this with JoelleLi and KiwiCJ over the course of a week.



### Technologies Used

* React
* HTML
* JavaScript
* CSS
* Axios
* Git
* GitHub
* Bash
* Node.js
* Photoshop
* Mongoose
* MongoDB



### Brief

* In a team, create a working full-stack, single-page application hosted on Netlify.
* Incorporate the technologies of the MERN-stack: MongoDB, Express, React and Node.
* Have a well-styled interactive front-end which communicates with the Express backend via Axios.
* Implement token-based authentication, including the ability of a user to sign up, log in and log out.
* Implement authorization by restricting CRUD data functionality to authenticated users.
* Navigation should respond to the login status of the user.
* Have a well-scoped feature-set.
* Optionally consume data from a third-party API.


### Planning

![ERD](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20ERD.png)


An early mockup of the homepage - navbar, features and project cards.

![HomePage](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20HomePage.png)

A plan for the user’s page:

![User's Page](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20MyPage.png)

The ‘project detail’ page:

![Project Detail](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20Project%20Detail.png)

A lot of planning went into this project. I created the majority of the illustrations and we worked as a team to manage workload, share ideas and assist with problems. The end projects of our excalidraw looked like this:

![Overall Planning](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20Overall%20Planning.png)


### Build/Code Process

We collectively set up the infrastructure for the project and began working on separate projects once KiwiCJ had finished implementing the GitHub Login API.

###### Backend

I got to work on the projectSchema and associated routes within the backend to get it fully CRUD-ing. I then started the ProjectContext.js file and worked on the axios paths such as the fetch request.

EDIT: I then later came back to this to add the getUserProjectsCollab function which would retrieve any projects where the username has occurred in any submitted projects’ ‘collaborator’ field.

The backend looks like this:

```
app.get("/projects/collab/:username", async (req, res) => {
    try {
        const username = req.params.username;
        
        const projects = await Project.find({
            $or: [
                { username },
                { collaborators: { $regex: new RegExp(username, 'i') } }
            ]
        });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found for the specified username" });
        } else {
            res.json(projects);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
```

###### ProjectCards and HomePage

Once the projects were populating on the frontend I then created the HomePage where the project cards would be seen. I used the aforementioned projectContext to retrieve the projects as an array and then mapped them out to display the information as a test. This then led me to create the projectCard.jsx file. This would take a singular project as a parameter and use that information to populate the card itself. Interestingly the ‘collaborators’ field would also require its own map to display multiple collaborators:

```
<div className='collaborators'>
          {project.collaborators ? 
          seperated.map((collaber, idx) => {
            return (
              <>
              {/* <div key={idx+numberSmile+idx}>&nbsp;</div>
              <div key={idx+numberSmile*2}>&nbsp;</div> */}
            <div className='collaber' style={{fontWeight: 'bold', color: 'black'}} key={idx}>
              <div className='placard'>
              &nbsp;{`${collaber}`}&nbsp;
              </div>
              </div>
            </>
            )
          })
           : <div >
```

###### Adding a new project

We knew from our planning that we wanted a modal to create a new project. For this I decided to use react bootstrap. Since I was using a context for the projects I needed to add the newly submitted project to the context after a successful submission to the Mongo database as we were using a SPA (and the application would not be prompted to get the new information sent in without refreshing the page).

```
  const {addProject, getProjects } = useProjects()


    async function handleSubmit(e){
        e.preventDefault()
        await addProject({
            projectName: titleRef.current.value,
            username: userData.login,
            collaborators: collabRef.current.value,
            description: descriptionRef.current.value,
            deploymentLink: deploymentLinkRef.current.value,
            userAvatarUrl: userData.avatar_url,
            repoLink: repoLinkRef.current.value
        })
        getProjects()
        handleClose()
    }
```

###### ProjectPage

I then created a project page to display the information of a single project when clicked on. It allows authorized users to update the project (if they are the creator) and renders an iframe of the project if it has a ‘published’ link.

![ProjectDetailActual](https://github.com/TKittow/Portfolio/blob/main/images/project3/Project%203%20-%20Project%20Detail%20Actual.png)

###### EditProjectPage

I created a form which generates a form populated with that project’s information. The project can also be deleted.



### Challenges

Working in a team was a very interesting, at times challenging, but overall thoroughly enjoyable process. I think due to how small the project was, it was very common to step on each other’s toes (especially when it came to merging). Initially, merge conflicts were commonplace but as we communicated more and identified the reasons as to why the conflicts were emerging in the first place, we brought the number of conflicts down to almost zero.


### Wins

After this project had been published and presented in our course, I continued working on it. We were getting a couple of bugs with the loading of the projects. For example, everytime you clicked on the logo or the home page in the top right, the ordering of the projects would flip from most recently added to least recently added. This was due to the backend request producing the list from the least recent project uploaded first. In hindsight I perhaps should have looked into how to change the request to flip the ordering so no information manipulation would occur whilst the page was loading but I instead flipped the order within useEffect. The error occurred because the same function I wrote to flip the projects’ order would run everytime the page was accessed.

As in the edit within the build section: I added the collaborated projects to display on the profile page. I was particularly happy with this as it was a challenging thought-experiment.

### Key Learnings/Takeaways

I learnt so much about teamwork and communication working on this project, my team was fantastic and we worked very effectively on a lot of challenges. Time-management was of particular importance on this project as I found myself always juggling the tasks I had set for myself with helping my teammates on their problems too.


### Future Improvements

A like feature for projects - this could just simply store which users liked them in an array and then display the length of the array as the count of likes.

Changing the method that adds the collaborators to the projects. It is currently stored as a string which separates based on spacing but instead I would like to change this to an array.

Performance updates
