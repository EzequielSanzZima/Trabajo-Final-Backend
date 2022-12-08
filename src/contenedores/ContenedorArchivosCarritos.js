const fs = require("fs");

class ContenedorArchivosCarritos {
  constructor(path) {
    this.path = path;
  }

  async getCart(cartId) {
    try {
      let cart;
      const contenido = await fs.promises.readFile(this.path, "utf-8");
      const carritos = JSON.parse(contenido);
      cart = carritos.find((carrito) => carrito.id == cartId);
      if (cart == undefined) {
        throw "No existe ese carrito";
      } else {
        return cart;
      }
    } catch (err) {
      return err;
    }
  }

  async deleteCartById(cartId) {
    try {
      const carritos = await this.getAll();
      const carritosActualizados = carritos.filter(
        (elemento) => elemento.id != cartId
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carritosActualizados, null, 2)
      );
    } catch (err) {
      return "El elemento no pudo ser eliminado";
    }
  }

  async deleteProductInCartById(productId, cartId) {
    try {
      const carritos = await this.getAll();
      const i = carritos.findIndex(
        (elemento) => elemento.id == cartId
      );
      if (i == -1) {
        throw "No existe el carrito";
      }
      const idProductosActualizados = carritos[
        i
      ].productsId.filter((elemento) => elemento != productId);

      carritos[i].productsId = idProductosActualizados;
      await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, 2));
    } catch (err) {
      return err;
    }
  }

  async addCart(cart) {
    let newId;
    try {
      if (fs.existsSync(this.path)) {
        let contenido = await this.getAll();
        if (contenido.length > 0) {
          newId = contenido[contenido.length - 1].id + 1;
          cart.id = newId;
          contenido.push(cart);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenido, null, 2)
          );
        } else {
          newId = 1;
          cart.id = newId;
          await fs.promises.writeFile(
            this.path,
            JSON.stringify([cart], null, 2)
          );
        }
      } else {
        newId = 1;
        cart.id = newId;
        await fs.promises.writeFile(this.path, JSON.stringify([cart], null, 2));
      }
      return newId;
    } catch (err) {
      console.log(err);
    }
  }

  async addProduct(productId, cartId) {
    try {
      const carritos = await this.getAll();
      const i = carritos.findIndex((elemento) => elemento.id == cartId);
      if (i == -1) {
        throw "No existe el carrito";
      }
      carritos[i].productsId.push(productId);
      await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, 2));
    } catch (err) {
      return err;
    }
  }

  async getAll() {
    try {
      const read = fs.readFileSync(this.path, "utf8");
      return JSON.parse(read);
    } catch (err) {
      throw err;
    }
  }
}
module.exports = ContenedorArchivosCarritos;
