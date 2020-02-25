import { parseISO, isBefore } from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class DeliverymanAccessController {
  async update(req, res) {
    const { deliveryman_id, delivery_id } = req.params;
    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exist.' });
    }

    const { start_date } = req.body;

    const data = parseISO(start_date);

    if (isBefore(data, new Date())) {
      return res.status(400).json({ error: 'Data inválida.' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliverymanAccessController();
