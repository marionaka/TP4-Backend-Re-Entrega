import express from 'express';
import { productsRouter } from "./routers/products.routers.js";
import { cartsRouter } from "./routers/carts.routers.js";
import ProductManager from "./models/ProductManager.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";

const app = express();
const productManager = new ProductManager("./products.json");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.engine("handlebars", handlebars.engine());

app.set("views", "views/");

app.use(express.static("public"));

app.use("/", viewsRouter);

app.set("view engine", "handlebars");

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);


const httpServer = app.listen(8080, ()=>{
    console.log('Escuchando en el puerto 8080');
})

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Se conecto un nuevo cliente");
  
    socket.emit("productList", await productManager.getProducts());

    socket.on("newProduct", async (product) => {
        await productManager.addProduct(product);
        socket.emit("productList", await productManager.getProducts());
    });

    socket.on("eraseProduct", async(id) => {
        await productManager.deleteProduct(id);
        socket.emit("productList", await productManager.getProducts());
    })
});