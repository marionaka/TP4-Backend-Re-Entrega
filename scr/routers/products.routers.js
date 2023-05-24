import { Router } from "express";
import ProductManager from "../models/ProductManager.js";

const productManager = new ProductManager("./products.json");
const productsRouter = Router();



productsRouter.get("/", async (req,res)=>{
    let limit = req.query.limit;
    console.log(limit);
    if(limit!=="0"){
        try{
            await productManager.readProductsFile();
            let allProducts = await productManager.getProducts();
            let productosFiltrados = allProducts.slice(0,limit);
            res.send(productosFiltrados);
        }
        catch(err){
            res.send(err);
        }    
    } else{
        let productosFiltrados = ""
        res.send(productosFiltrados);
    }
    
});


productsRouter.get("/:pid", async (req,res)=>{
    try{
        await productManager.readProductsFile();
        let allProducts = await productManager.getProducts();
        let ret = allProducts.find((products)=>{
            return products.id == req.params.pid;
            
        });
        console.log(ret);
        res.send(ret);   
    }
    catch(err){
        res.send(err);
    }      
     
});


productsRouter.post("/", async (req, res) => {
    try {
        const product = req.body;
        res.send(await productManager.addProduct(product));
      } catch (err) {
        res.send(err);
      }
});


productsRouter.put("/:pid", async (req, res) => {
    try {
      res.send(await productManager.updateProduct(parseInt(req.params.pid), req.body))
    } catch (err) {
      res.send(err);
    }
  });


productsRouter.delete("/:pid", async (req, res) => {
  try {
    res.send(await productManager.deleteProduct(parseInt(req.params.pid))); 
  } catch (err) {
    res.send(err);
  }
});


export {productsRouter};