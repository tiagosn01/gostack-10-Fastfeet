import { Router } from 'express';

const routes = new Router();

routes.get ('/', (req, res) => {
  return res.json({message: 'Heellow world'})
})

export default routes