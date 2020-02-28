import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class ProblemController {
  async store(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery does not exist.' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }
}

export default new ProblemController();
