import { Router } from "express";
import CartsManager from "../models/CartsManager.js";

const cartsManager = new CartsManager("./carts.json");
const cartsRouter = Router();



cartsRouter.post("/", async (req, res) => {
    try {
      const cart = {"products":[]};
      res.send(await cartsManager.addCart(cart));
    } catch (err) {
        res.send(err);
    }
});


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
      res.send(
        await cartsManager.addProdtoCart(
           parseInt(req.params.cid),
           parseInt(req.params.pid)
        )
        );
    } catch (err) {
        res.send(err);
    }
  });


cartsRouter.get("/", async (req, res) => {
    try {
      res.send(await cartsManager.getCarts());
    } catch (err) {
        res.send(err);
    }
});


cartsRouter.get("/:cid", async (req, res) => {
    try {
        let cartReq = await cartsManager.getCartById(
        parseInt(req.params.cid)
        );
        if (cartReq != undefined) {
        res.send(cartReq);
        } 
    } catch (err) {
        res.send(err);
    }
});


cartsRouter.delete("/:cid", async(req,res)=>{
    try {
        res.send(await cartsManager.deleteCart(parseInt(req.params.cid)))
    } catch (err) {
        res.send(err);
    }
})


export {cartsRouter};