import { Router } from 'express';

import envelopeValidator from '../app/validators/envelope.validator';
import envelopeController from '../app/controllers/envelope.controller';

class EnvelopeRouter {
  constructor() {
    this.router = Router();

    this.setRoutes();
  }

  setRoutes() {
    this.router
      .route('/envelope')
      .post(envelopeValidator, envelopeController.store);
  }
}

export default new EnvelopeRouter().router;
