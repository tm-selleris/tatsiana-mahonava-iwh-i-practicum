require('dotenv').config({ path: `${__dirname}/.env` });

const express = require('express');
const axios = require('axios');
const app = express();

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const OBJECT_TYPE_ID = '2-254130055';
const OBJECTS_URL = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}`;

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    if (!PRIVATE_APP_ACCESS) {
        return res.status(500).send('Настройте HUBSPOT_ACCESS_TOKEN в локальном файле .env.');
    }

    try {
        const response = await axios.get(OBJECTS_URL, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            },
            params: {
                properties: 'name,publisher,price',
                limit: 100
            }
        });

        return res.render('homepage', {
            title: 'Video Games | HubSpot Practicum',
            data: response.data.results
        });
    } catch (error) {
        console.error('Ошибка чтения записей HubSpot:', error.response?.data || error.message);
        return res.status(502).send('Не удалось загрузить записи из HubSpot. Проверьте токен и настройки объекта.');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

app.post('/update-cobj', async (req, res) => {
    if (!PRIVATE_APP_ACCESS) {
        return res.status(500).send('Настройте HUBSPOT_ACCESS_TOKEN в локальном файле .env.');
    }

    const name = String(req.body.name || '').trim();
    const publisher = String(req.body.publisher || '').trim();
    const price = String(req.body.price || '').trim();

    if (!name || !publisher || !price || !Number.isFinite(Number(price)) || Number(price) < 0) {
        return res.status(400).send('Заполните все поля. Цена должна быть числом не меньше нуля.');
    }

    try {
        await axios.post(OBJECTS_URL, {
            properties: { name, publisher, price }
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });

        return res.redirect('/');
    } catch (error) {
        console.error('Ошибка создания записи HubSpot:', error.response?.data || error.message);
        return res.status(502).send('Не удалось создать запись в HubSpot. Проверьте токен и названия свойств.');
    }
});

if (require.main === module) {
    app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));
}

module.exports = app;