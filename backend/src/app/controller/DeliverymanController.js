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

  async update(req, res) {
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

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    // Verificando email
    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) {
      return res.status(401).json({ error: 'Delivery man already exist' });
    }

    const { name, email } = await deliveryman.update(req.body);

    return res.json({ name, email });
  }
}

export default new DeliverymanController();
