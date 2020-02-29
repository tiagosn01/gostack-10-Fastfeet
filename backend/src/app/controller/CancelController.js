import ProblemController from '../models/DeliveryProblem';
import User from '../models/User';
import Delivery from '../models/Delivery';

class CancelController {
  /* Rota que lista todos problemas de uma entrega especifica pois
  / o método index do problem ja está listando todas as entregas
  */
  async index(req, res) {
    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const { id } = req.params;
    const listDelivery = await ProblemController.findAll({
      where: { delivery_id: id },
    });

    if (!listDelivery) {
      return res.status(401).json({ error: 'Deliveries not found.' });
    }

    return res.json(listDelivery);
  }

  async delete(req, res) {
    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const { id } = req.params;
    const problem = await ProblemController.findByPk(id);

    if (!problem) {
      return res.status(400).json({ error: 'Problem does not exist' });
    }

    const delivery = await Delivery.findOne({
      where: { id: problem.delivery_id },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    delivery.canceled_at = new Date();
    await delivery.save();
    return res.json(delivery);
  }
}

export default new CancelController();
