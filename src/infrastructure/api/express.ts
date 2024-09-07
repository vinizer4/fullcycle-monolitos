import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientsRoute } from "./routes/client.route";
import { productsRoute } from "./routes/product.route";
import { invoiceRoute } from "./routes/invoice.route";
import ClientModel from "../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import { checkoutRoute } from "./routes/checkout.route";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientsRoute);
app.use("/products", productsRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoices", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([ClientModel, ProductModel, InvoiceModel, InvoiceItemsModel, OrderModel]);
  await sequelize.sync();
}

setupDb();
