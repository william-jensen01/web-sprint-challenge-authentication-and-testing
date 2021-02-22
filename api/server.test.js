const request = require('supertest');
const server = require('./server');

describe("GET /", () => {
  let res;
  beforeEach(async () => {
    res = await request(server).get('/');
  })
  test("returns 200 OK", () => {
    return request(server).get("/").then(res => {
        expect(res.status).toBe(200);
      });
  });

  test("return api is up and running", () => {
    expect(res.body).toEqual({ api: "is up and running" })
  });

  test("JSON body", () => {
    expect(res.type).toBe("application/json")
  })
})