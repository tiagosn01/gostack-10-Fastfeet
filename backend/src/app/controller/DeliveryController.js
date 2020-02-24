import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async store(req, res) {
    // Delivery man exists
    const { deliveryman_id } = req.body;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'This delivery man does not exist.' });
    }

    // Recipient Exists
    const { recipient_id } = req.body;
    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'This recipient does not exist.' });
    }

    const { product } = req.body;

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();
