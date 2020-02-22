import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import User from '../models/User';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const listMan = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(listMan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { name, avatar_id, email } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const { email } = req.body;
    // Verificando se ja existe cadastro com o email
    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({
        where: { email: req.body.email },
      });

      if (emailExists) {
        return res.status(401).json({ error: 'Delivery man already exist' });
      }
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({ name, email });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    await deliveryman.destroy();

    return res.json({ message: 'Delivery man has been deleted' });
  }
}

export default new DeliverymanController();
