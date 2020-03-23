import { Router } from 'express';
import { readdirSync } from 'fs';
import { basename, resolve } from 'path';

const initialize = () => {
  const route = Router();

  readdirSync(__dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== basename(__filename) &&
        file.slice(-3) === '.js'
    )
    .forEach(file => {
      const pathFile = resolve(__dirname, file);
      const fileRouter = require(pathFile);
      route.use(fileRouter.default);
    });

  return route;
};

export default initialize();
