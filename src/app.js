const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateUuid = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository id.' });
  }
  return next();
};

const findRepository = (request, response, next) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  response.locals.repositoryIndex = repositoryIndex;

  return next();
};

app.use('/:resource/:id', validateUuid, findRepository);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;

  const { repositoryIndex } = response.locals;

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { repositoryIndex } = response.locals;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { repositoryIndex } = response.locals;

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
