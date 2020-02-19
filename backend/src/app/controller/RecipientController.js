import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const userExists = await Recipient.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'O usuário ja existe.' });
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
}

export default new RecipientController();
