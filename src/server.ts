import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import api from './utils/api';
import { estimatedAge } from './utils/functions';
import { requestLogger, errorLogger } from './middlewares/logger';
import axios from 'axios';

dotenv.config();

const { PORT } = process.env;

/* ------------------------------------------------------------------- */

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/amo-crm', async (req: Request, res: Response, next: NextFunction) => {
    console.log('req', req.query);

    console.log('------------------------------------------------');

    const answer = await axios({
        method: 'post',
        url: 'https://moma2108.amocrm.ru/oauth2/access_token',
        data: {
            client_id: req.query.client_id,
            client_secret:
                'H2zSopux81CjJy9YMv0mJt9e1zHlXRzk83pXvK2gwIefPRbRbMTUZkkRgJyUxXuA',
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: 'https://c540-77-95-90-50.ngrok-free.app/amo-crm',
        },
    });

    /* api.getAccessAndRefreshTokens({
        client_id: req.query.client_id,
        client_secret:
            'H2zSopux81CjJy9YMv0mJt9e1zHlXRzk83pXvK2gwIefPRbRbMTUZkkRgJyUxXuA',
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: 'https://c540-77-95-90-50.ngrok-free.app/amo-crm',
    }); */

    console.log('answer', answer);
});

/* app.post(
    '/amo-crm',
    async (req: Request, res: Response, next: NextFunction) => {
        //const contact = req.body.contacts.add[0];
        console.log(req); */

/*         const contactFields = await api.getContactFields();

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
        }); */
/*     }
); */

app.use(errorLogger);

app.listen(PORT ?? 3000, () => {
    console.log(`App listening on port ${PORT ?? 3000}`);
});
