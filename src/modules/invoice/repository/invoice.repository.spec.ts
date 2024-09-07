import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "./invoice.model"
import InvoiceItemsModel from "./invoice-items.model"
import Invoice from "../domain/invoice"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItens from "../domain/invoice-items"
import InvoiceRepository from "./invoice.repository"

const invoice = new Invoice({
  id: new Id("1"),
  name: "John",
  document: "123",
  address: new Address("Street", "123", "Complement", "City", "State", "80200"),
  items: [
    new InvoiceItens({
      id: new Id("1"),
      name: "Product 1",
      price: 100,
    }),
    new InvoiceItens({
      id: new Id("2"),
      name: "Product 2",
      price: 200,
    }),
  ],
});

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "John",
      document: "123",
      address: new Address("Street", "123", "Complement", "City", "State", "80200"),
      items: [
        new InvoiceItens({
          id: new Id("1"),
          name: "Product 1",
          price: 100,
        }),
        new InvoiceItens({
          id: new Id("2"),
          name: "Product 2",
          price: 200,
        }),
      ],
    });

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemsModel, as: "items" }],
    })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toBe(invoice.id.id)
    expect(invoiceDb.name).toBe(invoice.name)
    expect(invoiceDb.document).toBe(invoice.document)
    expect(invoiceDb.street).toBe(invoice.address.street)
    expect(invoiceDb.number).toBe(invoice.address.number)
    expect(invoiceDb.complement).toBe(invoice.address.complement)
    expect(invoiceDb.city).toBe(invoice.address.city)
    expect(invoiceDb.state).toBe(invoice.address.state)
    expect(invoiceDb.zip_code).toBe(invoice.address.zipCode)
    expect(invoiceDb.items.length).toBe(2)
    expect(invoiceDb.items[0].id).toBe(invoice.items[0].id.id)
    expect(invoiceDb.items[0].name).toBe(invoice.items[0].name)
    expect(invoiceDb.items[0].price).toBe(invoice.items[0].price)
    expect(invoiceDb.items[1].id).toBe(invoice.items[1].id.id)
    expect(invoiceDb.items[1].name).toBe(invoice.items[1].name)
    expect(invoiceDb.items[1].price).toBe(invoice.items[1].price)        
  })

  it("should find a invoice", async () => {
    


    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const result = await repository.find(invoice.id.id)

    expect(result.id.id).toEqual(invoice.id.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.address.street)
    expect(result.address.number).toEqual(invoice.address.number)
    expect(result.address.complement).toEqual(invoice.address.complement)
    expect(result.address.city).toEqual(invoice.address.city)
    expect(result.address.state).toEqual(invoice.address.state)
    expect(result.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.items[0].id.id).toEqual(invoice.items[0].id.id)
    expect(result.items[0].name).toEqual(invoice.items[0].name)
    expect(result.items[0].price).toEqual(invoice.items[0].price)
    expect(result.items[1].id.id).toEqual(invoice.items[1].id.id)
    expect(result.items[1].name).toEqual(invoice.items[1].name)
    expect(result.items[1].price).toEqual(invoice.items[1].price)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
  })

  it('Should not find an invoice', async () => {
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    await expect(repository.find('2')).rejects.toThrow(`Invoice not found`);
  });

})