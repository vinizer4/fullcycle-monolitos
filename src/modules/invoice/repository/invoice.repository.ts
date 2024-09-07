import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async generate(invoice: Invoice): Promise<void> {
    
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street, 
      number: invoice.address.number, 
      complement: invoice.address.complement, 
      city: invoice.address.city, 
      state: invoice.address.state, 
      zip_code: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price
        }
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    },{
      include: [InvoiceItemsModel]
    })

  }

  async find(id: string): Promise<Invoice> {
    
    const invoice = await InvoiceModel.findOne({ where: { id }, include: [InvoiceItemsModel] })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    const invoiceAsJson = invoice.toJSON();

    return new Invoice({
      id: new Id(invoiceAsJson.id),
      name: invoiceAsJson.name,
      document: invoiceAsJson.document,
      address: new Address(
        invoiceAsJson.street, 
        invoiceAsJson.number, 
        invoiceAsJson.complement, 
        invoiceAsJson.city, 
        invoiceAsJson.state, 
        invoiceAsJson.zip_code
      ),
      items: invoiceAsJson.items.map((item: any) => {
        return {
          id: new Id(item.id),
          name: item.name,
          price: item.price
        }
      }),
      createdAt: invoiceAsJson.createdAt,
      updatedAt: invoiceAsJson.updatedAt
    })
  }
}