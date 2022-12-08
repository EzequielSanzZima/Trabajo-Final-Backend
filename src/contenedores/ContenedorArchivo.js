const fs = require("fs");

class ContenedorArchivo {
  constructor(path) {
    this.path = path;
  }

  async getById(id) {
    try {
      let producto;
      const contenido = await fs.promises.readFile(this.path, "utf-8");
      const productos = JSON.parse(contenido);
      producto = productos.find((producto) => producto.id == id);
      if (producto == undefined) {
        throw "No existe ese producto";
      } else {
        return producto;
      }
    } catch (err) {
      return err;
    }
  }

  async deleteById(id) {
    try {
      const productos = await this.getAll();
      const productosActualizados = productos.filter(
        (elemento) => elemento.id != id
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productosActualizados, null, 2)
      );
    } catch (err) {
      return "El elemento no pudo ser eliminado";
    }
  }

  async addProduct(producto) {
    let newId;
    try {
      if (fs.existsSync(this.path)) {
        const contenido = await this.getAll();
        if (contenido.length > 0) {
          newId = parseInt(contenido[contenido.length - 1].id) + 1;
          producto.id = newId;
          contenido.push(producto);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenido, null, 2)
          );
        } else {
          newId = 1;
          producto.id = newId;
          await fs.promises.writeFile(
            this.path,
            JSON.stringify([producto], null, 2)
          );
        }
      } else {
        newId = 1;
        producto.id = newId;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify([producto], null, 2)
        );
      }
      return newId;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    try {
      const read = fs.readFileSync(this.path, "utf8");
      return JSON.parse(read);
    } catch (err) {
      return "No se pudo leer el archivo";
    }
  }

  async updateProduct(updatedProduct, id) {
    try {
      updatedProduct.id = id;
      const contenido = await fs.promises.readFile(this.path, "utf-8");
      const productos = JSON.parse(contenido);
      const posicionDelProducto = productos.findIndex(
        (producto) => producto.id == id
      );
      console.log(posicionDelProducto);
      productos[posicionDelProducto] = updatedProduct;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, 2)
      );

      return updatedProduct;
    } catch (err) {
      return "No se pudo actualizar el archivo";
    }
  }
}

module.exports = ContenedorArchivo;
