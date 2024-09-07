import { app, sequelize } from '../express';
import request from 'supertest';

describe('E2E test for invoice', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  
  it('should create an invoice', async () => {
    
    const input = {
      name: 'John Doe',
      document: '12345678901',
      street: 'Rua 1',
      number: '123',
      complement: 'apt 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 10
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20
        }
      ]
    }

    const response = await request(app).post('/invoices').send(input);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(input.name);
    expect(response.body.document).toBe(input.document);
    expect(response.body.street).toBe(input.street);
    expect(response.body.number).toBe(input.number);
    expect(response.body.complement).toBe(input.complement);
    expect(response.body.city).toBe(input.city);
    expect(response.body.state).toBe(input.state);
    expect(response.body.zipCode).toBe(input.zipCode);
    expect(response.body.items.length).toBe(input.items.length);
    expect(response.body.items[0].id).toBe(input.items[0].id);
    expect(response.body.items[0].name).toBe(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toBe(input.items[1].id);
    expect(response.body.items[1].name).toBe(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);
  });

  it('should find an invoice by id', async () => {
    
    const input = {
      name: 'John Doe',
      document: '12345678901',
      street: 'Rua 1',
      number: '123',
      complement: 'apt 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 10
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20
        }
      ]
    }

    const response = await request(app).post('/invoices').send(input);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(input.name);
    expect(response.body.document).toBe(input.document);
    expect(response.body.street).toBe(input.street);
    expect(response.body.number).toBe(input.number);
    expect(response.body.complement).toBe(input.complement);
    expect(response.body.city).toBe(input.city);
    expect(response.body.state).toBe(input.state);
    expect(response.body.zipCode).toBe(input.zipCode);
    expect(response.body.items.length).toBe(input.items.length);
    expect(response.body.items[0].id).toBe(input.items[0].id);
    expect(response.body.items[0].name).toBe(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toBe(input.items[1].id);
    expect(response.body.items[1].name).toBe(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);

    const responseInvoice = await request(app).get(`/invoices/${response.body.id}`).send();	

    expect(responseInvoice.status).toBe(200);
  })
})