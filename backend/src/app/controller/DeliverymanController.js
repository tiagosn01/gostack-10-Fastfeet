import Deliveryman from '../models/Deliveryman';
import User from '../models/User';

class DeliverymanController {
  async store(req, res) {
    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const manExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (manExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { name, avatar_id, email } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }
}

export default new DeliverymanController();
