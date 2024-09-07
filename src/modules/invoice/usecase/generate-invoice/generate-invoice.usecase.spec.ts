import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItens from "../../domain/invoice-items";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

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
    generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};

describe("Generate Invoice Usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(invoiceRepository);
    const input: GenerateInvoiceUseCaseInputDto = {
      name: "John",
      document: "123",
      street: "Street",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "80200",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },       
      ],      
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.street).toEqual(invoice.address.street);
    expect(result.number).toEqual(invoice.address.number);
    expect(result.complement).toEqual(invoice.address.complement);
    expect(result.city).toEqual(invoice.address.city);
    expect(result.state).toEqual(invoice.address.state);
    expect(result.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items).toHaveLength(2)
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.total).toEqual(invoice.total());
  });
});
