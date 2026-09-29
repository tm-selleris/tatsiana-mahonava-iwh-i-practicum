const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.HUBSPOT_ACCESS_TOKEN = 'test-token';

const axios = require('axios');
const app = require('../index');

let server;
let baseUrl;
const originalGet = axios.get;
const originalPost = axios.post;

before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    axios.get = originalGet;
    axios.post = originalPost;
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('GET / рендерит таблицу с записями HubSpot и запрашивает все три свойства', async () => {
    let requestUrl;
    let requestConfig;
    axios.get = async (url, config) => {
        requestUrl = url;
        requestConfig = config;
        return {
            data: {
                results: [{ properties: { name: 'Test Game', publisher: 'Test Studio', price: '12' } }]
            }
        };
    };

    const response = await fetch(baseUrl);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /Custom Object Table/);
    assert.match(html, /Add to this table/);
    assert.match(html, /Test Game/);
    assert.match(html, /Test Studio/);
    assert.match(html, /12 USD/);
    assert.equal(requestUrl, 'https://api.hubapi.com/crm/v3/objects/2-254130055');
    assert.equal(requestConfig.params.properties, 'name,publisher,price');
    assert.equal(requestConfig.headers.Authorization, 'Bearer test-token');
});

test('GET /update-cobj показывает форму и ссылку на главную', async () => {
    const response = await fetch(`${baseUrl}/update-cobj`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /Update Custom Object Form \| Integrating With HubSpot I Practicum/);
    assert.match(html, /action="\/update-cobj"/);
    assert.match(html, /name="name"/);
    assert.match(html, /name="publisher"/);
    assert.match(html, /name="price"/);
    assert.match(html, /Return to the homepage/);
});

test('POST /update-cobj создаёт запись и перенаправляет на главную', async () => {
    let requestUrl;
    let requestData;
    let requestConfig;
    axios.post = async (url, data, config) => {
        requestUrl = url;
        requestData = data;
        requestConfig = config;
        return { data: { id: 'test-record-id' } };
    };

    const response = await fetch(`${baseUrl}/update-cobj`, {
        method: 'POST',
        redirect: 'manual',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name: 'Test Game', publisher: 'Test Studio', price: '12' })
    });

    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/');
    assert.equal(requestUrl, 'https://api.hubapi.com/crm/v3/objects/2-254130055');
    assert.deepEqual(requestData, {
        properties: { name: 'Test Game', publisher: 'Test Studio', price: '12' }
    });
    assert.equal(requestConfig.headers.Authorization, 'Bearer test-token');
});

test('POST /update-cobj отклоняет пустые поля и некорректную цену', async () => {
    let hubSpotWasCalled = false;
    axios.post = async () => {
        hubSpotWasCalled = true;
        throw new Error('Запрос не должен отправляться');
    };

    const response = await fetch(`${baseUrl}/update-cobj`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name: '', publisher: 'Test Studio', price: 'not-a-number' })
    });

    assert.equal(response.status, 400);
    assert.equal(hubSpotWasCalled, false);
});