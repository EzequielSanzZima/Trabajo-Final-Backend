class carrito {
  constructor(timestamp, productsId, description, thumbnail, price, stock) {
    this.timestamp = timestamp;
    this.productsId = productsId;
    this.description = description;
    this.thumbnail = thumbnail;
    this.price = price;
    this.stock = stock;
  }
}
module.exports = carrito;
