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
import CancelController from './app/controller/CancelController';

import authMiddleware from './app/middlewares/auth';
import DeliverymanAccessController from './app/controller/DeliverymanAccessController';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Rotas de acesso do entregador
// Rota para alterações da entrega
routes.put(
  '/deliveryman/:deliveryman_id/:delivery_id',
  DeliverymanAccessController.update
);
// Rota para Criação de um problema na entrega
routes.post('/delivery/:id/problems', ProblemController.store);

// Rota que lista todas as entregas do entregador. Usar Open ou Closed no req.body para especificar
routes.get('/deliveryman/:id/deliveries', DeliverymanAccessController.index);

routes.use(authMiddleware);

// Rota para criação de usuário se necessário
routes.post('/users', UserController.store);

// Rotas apra endereços
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// Rotas para entregadores
routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

// Rotas para entregas
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Lista todas entregas com problemas
routes.get('/deliveries/problems', ProblemController.index);

// Lista todas problemas de uma entrega especifica
routes.get('/delivery/:id/problems', CancelController.index);

// Cancelar uma entrega
routes.delete('/problem/:id/cancel-delivery', CancelController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
