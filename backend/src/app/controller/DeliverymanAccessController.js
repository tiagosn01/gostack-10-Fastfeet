import * as Yup from 'yup';
import {
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class DeliverymanAccessController {
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
    const checkStart = await Delivery.findOne({
      where: {
        id: delivery_id,
        start_date: null,
      },
    });

    if (!checkStart) {
      return res.status(401).json({ error: 'Delivery has already left' });
    }

    const { start_date, signature_id } = req.body;

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
      return res.status(400).json({ error: 'Working hours from 8 am to 6 pm' });
    }

    if (signature_id) {
      delivery.signature_id = signature_id;
      delivery.end_date = new Date();
    } else if (!signature_id) {
      return res
        .status(401)
        .json({ error: 'Signature is required to close orders' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliverymanAccessController();
