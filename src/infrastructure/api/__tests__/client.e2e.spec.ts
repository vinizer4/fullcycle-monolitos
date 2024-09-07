import { app, sequelize } from '../express';
import request from "supertest";

describe("E2E test for client", () => {
  
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {

    const input = {
      name: "Client 1",
      email: "email",
      document: "document",
      street: "street",
      number: 1,
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode"
    };

    const response = await request(app)
      .post("/clients")
      .send(input);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(input.name);
    expect(response.body.email).toBe(input.email);
    expect(response.body.document).toBe(input.document);
    expect(response.body.street).toBe(input.street);
    expect(response.body.number).toBe(input.number);
    expect(response.body.complement).toBe(input.complement);
    expect(response.body.city).toBe(input.city);
    expect(response.body.state).toBe(input.state);
    expect(response.body.zipCode).toBe(input.zipCode);
  });
});