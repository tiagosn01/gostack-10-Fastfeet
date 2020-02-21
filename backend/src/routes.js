import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import RecipientController from './app/controller/RecipientController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import DeliverymanController from './app/controller/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
