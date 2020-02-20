import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Check User is admin
    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const recipientExists = await Recipient.findOne({
      where: { email: req.body.email },
    });

    if (recipientExists) {
      return res.status(401).json({ error: 'Recipient already exists.' });
    }

    const {
      name,
      email,
      street,
      number,
      complement,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      email,
      street,
      number,
      complement,
      state,
      city,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Check User is admin
    const isAdmin = await User.findOne({
      where: { id: req.userId, provider: false },
    });

    if (!isAdmin) {
      return res.status(401).json('User is not an admin');
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    });
  }
}

export default new RecipientController();
