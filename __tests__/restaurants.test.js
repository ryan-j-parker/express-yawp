const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'mashed@potatoes.gravy',
  firstName: 'Scrumbledore',
  lastName: 'Lastnamerson',
  password: 'hashymash1257',
};

describe('restaurants routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /api/v1/restaurants should retrieve a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "cost": 1,
          "cuisine": "American",
          "id": "1",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
          "name": "Pip's Original",
          "website": "http://www.PipsOriginal.com",
        },
        Object {
          "cost": 3,
          "cuisine": "Italian",
          "id": "2",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/af/df/89/duck.jpg",
          "name": "Mucca Osteria",
          "website": "http://www.muccaosteria.com",
        },
        Object {
          "cost": 2,
          "cuisine": "Mediterranean",
          "id": "3",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/f2/e5/0c/dinner.jpg",
          "name": "Mediterranean Exploration Company",
          "website": "http://www.mediterraneanexplorationcompany.com/",
        },
        Object {
          "cost": 2,
          "cuisine": "American",
          "id": "4",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/0d/d6/a1/06/chocolate-gooey-brownie.jpg",
          "name": "Salt & Straw",
          "website": "https://saltandstraw.com/pages/nw-23",
        },
      ]
    `);
  });

  it('GET /api/v1/restaurants/:restId should return a restaurant by ID', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  const registerAndLogin = async (userProps = {}) => {
    const password = userProps.password ?? mockUser.password;
    const agent = request.agent(app);
    const user = await UserService.create({ ...mockUser, ...userProps });

    const { email } = user;
    await agent.post('/api/v1/users/sessions').send({ email, password });
    return [agent, user];
  };

  it('POST /api/v1/restaurants/:id/reviews should add a review', async () => {
    const [agent] = await registerAndLogin();
    console.log('agent: ', agent);
    const res = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 5, review: 'This is a test review' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": null,
        "id": "4",
        "restaurant_id": "1",
        "stars": 5,
        "user_id": "4",
      }
    `);
  });
});
