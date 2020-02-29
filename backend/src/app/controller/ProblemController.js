import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class ProblemController {
  async index(req, res) {
    const listAll = await DeliveryProblem.findAll();

    return res.json(listAll);
  }

  async store(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery does not exist.' });
    }

    if (delivery.end_date !== null) {
      return res
        .status(401)
        .json({ error: 'Delivery has already been completed.' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }
}

export default new ProblemController();
