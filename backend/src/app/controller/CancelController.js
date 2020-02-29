import ProblemController from '../models/DeliveryProblem';
import User from '../models/User';
import Delivery from '../models/Delivery';
import Mail from '../../lib/Mail';
import Deliveryman from './DeliveryController';

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

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    delivery.canceled_at = new Date();
    await delivery.save();

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancelattion',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
      },
    });
    return res.json(delivery);
  }
}

export default new CancelController();
