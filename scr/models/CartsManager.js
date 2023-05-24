import fs from "fs";

export default class CartsManager {
  constructor() {
    // Si no existe ./products.json
    if (!fs.existsSync("./carts.json")) {
      // escribo el archivo de forma sincronica con un array vacio
      fs.writeFileSync("./carts.json", JSON.stringify([]));
    }
    this.path = "./carts.json";
    this.carts = [];
    this.lastID = 0;
    this.readCartsFile();
  }


  async readCartsFile() {
    try {
      const data = fs.readFileSync(this.path);
      this.carts = JSON.parse(data);
      this.lastID = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`El archivo ${this.path} no existe. Se creará automáticamente.`);
      } else {
        console.log(`Error al leer el archivo ${this.path}: ${error}`);
      }
    }
  }


  async addCart(cart) {
    this.lastID++;
    cart.id = this.lastID;
    this.carts.push(cart);
    await this.saveCarts();
    console.log(`El carrito ha sido agregado correctamente`);
  }


  async saveCarts() {
    const data = JSON.stringify(this.carts);
    try {
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.log(`Error al guardar el archivo ${this.path}: ${error}`);
    }
  }


  async getCarts() {
    const carts = [...this.carts];
    return carts;
  } 


  async getCartById(id) {
    const carrito = this.carts.find((p) => p.id === id);
    if (carrito) {
      console.log(`Carrito con ID ${id}:`);
      console.log(carrito);
    } else {
      console.log(`No se encontró un producto con ID ${id}`);
    }
  }




  async addProdtoCart(cid, pid) {
    try {
      const carritoSeleccionado = this.carts.find((p) => p.id === cid);

      
      let listaProductos = JSON.parse(await fs.promises.readFile("./products.json", "utf-8"));
      let productoSeleccionado = listaProductos.find((prod) => {return prod.id == pid;});
      let encontroProducto = false;

       carritoSeleccionado.products.forEach((prod) => {
        if (prod.id === productoSeleccionado.id) {
          encontroProducto = true;
          productoExistente = prod;
        }
      });

      if (encontroProducto) {
        productoExistente.cantidad++; //Si el producto existe, se aumenta su cantidad en 1
      } else {
        carritoSeleccionado.products.push({ id: productoSeleccionado.id, cantidad: 1 }); //Si el producto no existe, se ingresa en el carrito con cantidad de 1.
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carritoSeleccionado));
    } catch (err) {
      console.log(`Error al agregar el producto al carrito por ID: ${err}`);
    }
  }




}