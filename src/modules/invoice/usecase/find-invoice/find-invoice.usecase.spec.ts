import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItens from "../../domain/invoice-items";
import FindInvoiceUsecase from "./find-invoice.usecase";

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

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
}

describe("Find Invoice Usecase unit test", () => {
  it("should find a invoice", async () => {
    const invoiceRepository = MockRepository();

    const findUseCase = new FindInvoiceUsecase(invoiceRepository);
    const output = await findUseCase.execute(invoice.id);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipCode);
    expect(output.items[0].id).toBe(invoice.items[0].id.id);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);
    expect(output.items[1].id).toBe(invoice.items[1].id.id);
    expect(output.items[1].name).toBe(invoice.items[1].name);
    expect(output.items[1].price).toBe(invoice.items[1].price);
    expect(output.total).toBe(invoice.total());
    expect(output.createdAt).toStrictEqual(invoice.createdAt);    
  })
})