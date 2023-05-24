import fs from "fs";

export default class ProductManager {
  constructor() {
    // Si no existe ./products.json
		if (!fs.existsSync('./products.json')) {
			// escribo el archivo de forma sincronica con un array vacio
			fs.writeFileSync('./products.json', JSON.stringify([]));
    }
    this.path = './products.json';
    this.products = [];
    this.lastID = 0;
    this.readProductsFile();
  }

  async readProductsFile() {
    try {
      const data = fs.readFileSync(this.path);
      this.products = JSON.parse(data);
      this.lastID = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`El archivo ${this.path} no existe. Se creará automáticamente cuando se agregue un producto.`);
      } else {
        console.log(`Error al leer el archivo ${this.path}: ${error}`);
      }
    }
  }

  async addProduct(producto) {
    this.lastID++;
    producto.id = this.lastID;
    this.products.push(producto);
    await this.saveProducts();
    console.log(`El producto ${producto.name} ha sido agregado correctamente`);
  }

  async getProducts() {
    const products = [...this.products];
/*     console.log('Lista de productos:');
    console.log(products); */
    return products;
  }

  async getProductById(id) {
    const producto = this.products.find((p) => p.id === id);
    if (producto) {
      console.log(`Producto con ID ${id}:`);
      console.log(producto);
    } else {
      console.log(`No se encontró un producto con ID ${id}`);
    }
  }

  async updateProduct(id, campos) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...campos,
        id,
      };
      await this.saveProducts();
      console.log(`El producto con ID ${id} ha sido actualizado correctamente`);
      return true;
    } else {
      console.log(`No se encontró un producto con ID ${id}`);
      return false;
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1);
      await this.saveProducts();
      console.log(`El producto con ID ${id} ha sido eliminado correctamente`);
      return true;
    } else {
      console.log(`No se encontró un producto con ID ${id}`);
      return false;
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products);
    try {
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.log(`Error al guardar el archivo ${this.path}: ${error}`);
    }
  }
}

async function test() {
  const productManager = new ProductManager();

  // Prueba de addProduct
  const newProduct = {
    name: "Nuevo producto",
    price: 90,
    description: "Descripción del nuevo producto"
  };
  await productManager.addProduct(newProduct);
  await productManager.getProducts();

  // Prueba de getProductById
  await productManager.getProductById(1);

  // Prueba de updateProduct
  const updatedFields = {
    name: "Producto actualizado",
    price: 180
  };
  await productManager.updateProduct(1, updatedFields);
  await productManager.getProducts();

/*   // Prueba de deleteProduct
  await productManager.deleteProduct(1);
  await productManager.getProducts(); */
}

/* test(); */