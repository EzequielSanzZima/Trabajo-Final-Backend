const express = require("express");
const app = express();
const { Router } = express;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Router
const routerProductos = Router();
app.use("/api/productos", routerProductos);
const routerCarrito = Router();
app.use("/api/carrito", routerCarrito);

app.use("*", (req, res) => {
  res
    .status(404)
    .send({
      status: "error",
      description: `ruta ${req.url} método ${req.method} no implementada`,
    });
});

const contenedorProductos = require("./contenedores/ContenedorArchivo.js");
const productService = new contenedorProductos("./dataBase/dbProductos.json");

const ContenedorCarrio = require("./contenedores/ContenedorArchivosCarritos.js");
const cartService = new ContenedorCarrio("./dataBase/dbCarritos.json");

const Carrito = require("./obj/cartConstrucctor.js");
const Productos = require("./obj/productConstrucctor.js");


// Middleware Admin
function questionIsAAdmin(ruta, metodo) {
  const error = {
    error: -1,
  };
  if (ruta && metodo) {
    error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`;
  } else {
    error.descripcion = "no autorizado";
  }
  return error;
}

const isAdmin = true;

function adminOnly(req, res, next) {
  if (!isAdmin) {
    res.json(questionIsAAdmin(req.url, req.method));
  } else {
    next();
  }
}

// Productos endpoints
routerProductos.get("/", async (req, res) => {
  const result = await productService.getAll();
  if (typeof result == "string") {
    res.status(404).send("El archivo no existe");
  } else {
    res.json(result);
  }
});

routerProductos.get("/:id", async (req, res) => {
  console.log(`Busco el objeto con id: ${req.params.id}`);
  res.json(await productService.getById(req.params.id));
});

routerProductos.post("/", adminOnly, async (req, res) => {
  try {
    const product = new Productos(
      req.body.title,
      req.body.price,
      req.body.thumbnail
    );
    const result = await productService.addProduct(product);
    res.json(result);
  } catch (error) {
    return "Faltan datos del producto";
  }
});

routerProductos.put("/", adminOnly, async (req, res) => {
  try {
    if (
      req.body.title == undefined ||
      req.body.price == undefined ||
      req.body.thumbnail == undefined
    ) {
      throw "Faltan datos del producto a actualizar";
    } else {
      const product = new Productos(
        req.body.title,
        req.body.price,
        req.body.thumbnail
      );
      const result = await productService.updateProduct(product, req.body.id);
      res.json(result);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

routerProductos.delete("/:id", adminOnly, async (req, res) => {
  const result = await productService.deleteById(req.params.id);
  res.json(result);
});

//Carrito endpoints
routerCarrito.get("/:id/productos", async (req, res) => {
  const result = await cartService.getCart(req.params.id);
  if (typeof result == "string") {
    res.status(404).send("El carrito no existe");
  } else {
    res.json(result);
  }
});

routerCarrito.post("/", async (req, res) => {
  try {
    let carrito = new Carrito(
      + new Date() ,req.body.productsId == undefined ? [] : req.body.productsId
    );
    let result = cartService.addCart(carrito);
    console.log(`Busco el objeto con id: ${req.params.id}`);
    res.json(result);
  } catch (error) {
    return error;
  }
});

routerCarrito.post("/:id/productos", async (req, res) => {
  try {
    const result = await cartService.addProduct(req.body.id, req.params.id);
    res.json(result);
  } catch (error) {
    return error;
  }
});

routerCarrito.delete("/:id", async (req, res) => {
  const result = await cartService.deleteCartById(req.params.id);
  res.json(result);
});

routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const result = await cartService.deleteProductInCartById(
    req.params.id_prod,
    req.params.id
  );
  res.json(result);
});

//Puerto
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
