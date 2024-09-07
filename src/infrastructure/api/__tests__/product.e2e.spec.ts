import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for product", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      stock: 1,
      purchasePrice: 100
    };
    
    const response = await request(app).post("/products").send(input);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(input.name);
    expect(response.body.description).toBe(input.description);
    expect(response.body.stock).toBe(input.stock);
    expect(response.body.purchasePrice).toBe(input.purchasePrice);

  });

});