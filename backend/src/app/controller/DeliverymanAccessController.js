import * as Yup from 'yup';
import {
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliverymanAccessController {
  async index(req, res) {
    const { id } = req.params;
    const list = await Delivery.findAll({
      where: { deliveryman_id: id },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      order: ['created_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'city',
            'state',
          ],
        },
      ],
    });

    return res.json(list);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

    // check se a entrega existe
    const { deliveryman_id, delivery_id } = req.params;
    const { start_date, signature_id } = req.body;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    // check se o entregador existe
    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exist.' });
    }

    // check se a encomenda ja saiu pra entrega

    if (start_date) {
      const alreadyStart = delivery.start_date;
      if (alreadyStart) {
        return res.status(401).json({ error: 'Delivery has already left' });
      }
    }

    const startDate = parseISO(start_date);

    // check se data ja passou
    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    // check se está entre 8 e 18
    const today = new Date();

    const start = setSeconds(setMinutes(setHours(today, 8), 0), 0);
    const end = setSeconds(setMinutes(setHours(today, 18), 0), 0);

    if (isBefore(today, start) || isAfter(today, end)) {
      return res.status(400).json({ error: 'Working time 8 am to 6 pm' });
    }

    const { count } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: delivery.deliveryman_id,
        canceled_at: null,
        start_date: { [Op.between]: [start, end] },
      },
    });

    if (count === 5) {
      return res
        .status(400)
        .json({ error: 'You can make only 5 deliveries for day' });
    }

    // check se a entrega ja foi feita
    if (signature_id) {
      const alreadyEnd = delivery.signature_id;
      if (alreadyEnd) {
        return res
          .status(401)
          .json({ error: 'Delivery has already been made' });
      }
      // check se a entrega esta com os start date preenchido
      if (delivery.start_date === null) {
        return res
          .status(401)
          .json({ error: 'This delivery did not come out' });
      }
      delivery.signature_id = signature_id;
      delivery.end_date = new Date();
    }

    await delivery.save();
    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliverymanAccessController();
