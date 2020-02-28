import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import RecipientController from './app/controller/RecipientController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import DeliverymanController from './app/controller/DeliverymanController';
import DeliveryController from './app/controller/DeliveryController';
import ProblemController from './app/controller/ProblemController';

import authMiddleware from './app/middlewares/auth';
import DeliverymanAccessController from './app/controller/DeliverymanAccessController';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.put(
  '/deliveryman/:deliveryman_id/:delivery_id',
  DeliverymanAccessController.update
);
routes.post('/delivery/:id/problems', ProblemController.store);
routes.get('/deliveryman/:id/deliveries', DeliverymanAccessController.index);

routes.use(authMiddleware);

routes.post('/users', UserController.store);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
