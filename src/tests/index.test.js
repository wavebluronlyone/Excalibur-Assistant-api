const app = require('../index');

describe('server test', () => {
	afterAll(() => {
		app.close();
	});

	test('responds with success on request /', async(done) => {
		const response = await app.inject({
			method: 'GET',
			url: '/'
		});
		expect(response.statusCode).toBe(200);
		done();
	});
});
