const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function foundIndex(request, response, next) {
  const {id} = request.params;
  
  const projectIndex = repositories.findIndex(project =>project.id === id);

  return next();
};

function validateProjectID(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Invalid project ID.'})
  };

  return next();
};

app.use('/repositories/:id', validateProjectID, foundIndex);

app.get("/repositories", (request, response) => {


  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(project);

  return response.json(project);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const projectIndex = repositories.findIndex(project =>project.id === id);
  const {likes} = repositories[projectIndex]; 


  const project = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[projectIndex] = project;

  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const projectIndex = repositories.findIndex(project =>project.id === id)


  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  const project = repositories.find(project =>project.id === id);

  project.likes += 1;

  return response.json(project);
});

module.exports = app;
