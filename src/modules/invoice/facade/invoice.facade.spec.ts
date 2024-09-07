import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";
import InvoiceFacadeFactory from "../factory/facade.factory";

const input: GenerateInvoiceFacadeInputDto = {
  name: "test",
  document: "123",
  street: "test",
  number: "123",
  complement: "test",
  city: "test",
  state: "test",
  zipCode: "123",
  items: [
    {
      id: "1",
      name: "test",
      price: 10
    },
    {
      id: "2",
      name: "test",
      price: 20
    }
  ]
}

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    
    const invoiceFacade = InvoiceFacadeFactory.create();    
    const result = await invoiceFacade.generate(input);
    const invoiceDb = await InvoiceModel.findOne({ where: { id: result.id }, include: [InvoiceItemsModel] } );

    const invoiceDbAsJson = invoiceDb.toJSON();

    expect(invoiceDbAsJson).toBeDefined();  
    expect(invoiceDbAsJson.name).toBe(input.name);
    expect(invoiceDbAsJson.document).toBe(input.document);
    expect(invoiceDbAsJson.street).toBe(input.street);
    expect(invoiceDbAsJson.number).toBe(input.number);
    expect(invoiceDbAsJson.complement).toBe(input.complement);
    expect(invoiceDbAsJson.city).toBe(input.city);
    expect(invoiceDbAsJson.state).toBe(input.state);
    expect(invoiceDbAsJson.zip_code).toBe(input.zipCode);
    expect(invoiceDbAsJson.items.length).toBe(2);
    expect(invoiceDbAsJson.items[0].id).toBe(input.items[0].id);
    expect(invoiceDbAsJson.items[0].name).toBe(input.items[0].name);
    expect(invoiceDbAsJson.items[0].price).toBe(input.items[0].price);
    expect(invoiceDbAsJson.items[1].id).toBe(input.items[1].id);
    expect(invoiceDbAsJson.items[1].name).toBe(input.items[1].name);
    expect(invoiceDbAsJson.items[1].price).toBe(input.items[1].price);    

  });

  it("should find a invoice", async () => {

    const invoiceFacade = InvoiceFacadeFactory.create();
    const result = await invoiceFacade.generate(input);
    const invoiceDb = await InvoiceModel.findOne({ where: { id: result.id }, include: [InvoiceItemsModel] } );

    const invoiceDbAsJson = invoiceDb.toJSON();

    expect(invoiceDbAsJson).toBeDefined();  
    expect(invoiceDbAsJson.name).toBe(input.name);
    expect(invoiceDbAsJson.document).toBe(input.document);
    expect(invoiceDbAsJson.street).toBe(input.street);
    expect(invoiceDbAsJson.number).toBe(input.number);
    expect(invoiceDbAsJson.complement).toBe(input.complement);
    expect(invoiceDbAsJson.city).toBe(input.city);
    expect(invoiceDbAsJson.state).toBe(input.state);
    expect(invoiceDbAsJson.zip_code).toBe(input.zipCode);
    expect(invoiceDbAsJson.items.length).toBe(2);
    expect(invoiceDbAsJson.items[0].id).toBe(input.items[0].id);
    expect(invoiceDbAsJson.items[0].name).toBe(input.items[0].name);
    expect(invoiceDbAsJson.items[0].price).toBe(input.items[0].price);
    expect(invoiceDbAsJson.items[1].id).toBe(input.items[1].id);
    expect(invoiceDbAsJson.items[1].name).toBe(input.items[1].name);
    expect(invoiceDbAsJson.items[1].price).toBe(input.items[1].price);
  })

  it("It shouldn't find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    await expect(invoiceFacade.find({ id: 'invalid-id' })).rejects.toThrow(
      `Invoice not found`
    );
  });

})