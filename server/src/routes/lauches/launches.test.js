
const request = require('supertest');
const app = require('../../app');


describe('Test Get /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app).get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});


describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-186 f",
        launcheDate: 'January 4, 2028'
    };
    const launchDateWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-186 f"
    };
    test("It should respond with 201 created", async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)
            .expect(400);
        const requestDate = new Date(completeLaunchData.launcheDate).valueOf();
        const responseDate = new Date(response.body.launcheDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDateWithoutDate);
    });
    test('It should catch missing required properties', () => {
    });
    test('It should catch invalid dates', () => {

    })
});

