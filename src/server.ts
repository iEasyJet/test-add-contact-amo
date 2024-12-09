import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import api from './utils/api';
import { estimatedAge } from './utils/functions';
import { requestLogger, errorLogger } from './middlewares/logger';

dotenv.config();

const { PORT } = process.env;

/* ------------------------------------------------------------------- */

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post(
    '/amo-crm',
    async (req: Request, res: Response, next: NextFunction) => {
        const contact = req.body.contacts.add[0];
        const contactFields = await api.getContactFields();

        const ageField = contactFields._embedded.custom_fields.filter((el) => {
            return el.name === 'Возраст' && el.entity_type === 'contacts';
        })[0];

        const contactAge = contact.custom_fields.filter((el) => {
            return el.name === 'Дата рождения';
        })[0].values[0];

        const ageValue = estimatedAge(contactAge);

        await api.changeContactInfo(contact.id, {
            custom_fields_values: [
                {
                    field_id: ageField.id,
                    values: [{ value: ageValue }],
                },
            ],
        });
    }
);

app.use(errorLogger);

app.listen(PORT ?? 3000, () => {
    console.log(`App listening on port ${PORT ?? 3000}`);
});
