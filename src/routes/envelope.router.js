import { Router } from 'express';

import envelopeController from '../app/controllers/envelope.controller';

class EnvelopeRouter {
  constructor() {
    this.router = Router();

    this.setRoutes();
  }

  setRoutes() {
    this.router.route('/envelope').post(envelopeController.store);
  }
}

export default new EnvelopeRouter().router;
