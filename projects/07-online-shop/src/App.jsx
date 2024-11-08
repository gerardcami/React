import data from "./data/data.json";
import "./App.css";
import { useState, useEffect } from "react";

// Función para añadir un ID único a cada producto
const addItemId = (list) => {
  return list.map((item) => ({
    ...item,
    objectID: crypto.randomUUID(),
  }));
};

function App() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [isNotAvailable, setIsNotAvailable] = useState({});

  // Cargar los productos con IDs únicos
  useEffect(() => {
    const updatedProducts = addItemId(data.products);
    setProducts(updatedProducts);
  }, []);

  // Función para verificar el stock disponible
  const checkStock = (product, amount) => {
    const cartAmount =
      cartProducts.find((item) => item.objectID === product.objectID)?.amount ||
      0;
    return amount + cartAmount <= product.stock;
  };

  // Actualizar las cantidades de productos
  const handleQuantityChange = (itemID, newQuantity) => {
    const product = products.find((prod) => prod.objectID === itemID);
    if (!product || !checkStock(product, newQuantity)) return;

    setQuantities((prev) => ({
      ...prev,
      [itemID]: newQuantity,
    }));
  };

  // Añadir un producto al carrito
  const handleAddCart = (product, event) => {
    event.preventDefault();
    const amount = quantities[product.objectID] || 1;

    if (!checkStock(product, amount)) {
      setIsNotAvailable((prev) => ({
        ...prev,
        [product.objectID]: true,
      }));
      return;
    }

    const newCartList = cartProducts.find(
      (item) => item.objectID === product.objectID
    )
      ? cartProducts.map((item) =>
          item.objectID === product.objectID
            ? {
                objectID: product.objectID,
                amount: item.amount + amount,
                name: product.name,
              }
            : item
        )
      : [
          ...cartProducts,
          {
            objectID: product.objectID,
            amount: amount,
            name: product.name,
          },
        ];

    setCartProducts(newCartList);
    setIsNotAvailable((prev) => ({
      ...prev,
      [product.objectID]: false,
    }));
  };

  // Verificar disponibilidad de stock
  useEffect(() => {
    const availability = {};
    products.forEach((product) => {
      const stock = product.stock || 0;
      const cartAmount =
        cartProducts.find((item) => item.objectID === product.objectID)
          ?.amount || 0;
      availability[product.objectID] = cartAmount >= stock;
    });
    setIsNotAvailable(availability);
  }, [cartProducts, products]);

  return (
    <>
      <h1>Alternova Shop</h1>
      <div>
        <section>
          {products.map((product) => (
            <article className="productCard" key={product.objectID}>
              <img
                className="productCover"
                src={product.image}
                alt={`Image: ${product.name}`}
              />
              <div>
                <h2>{product.name}</h2>
                <form onSubmit={(event) => handleAddCart(product, event)}>
                  <label htmlFor="quantity">Quantity: </label>
                  <input
                    type="number"
                    value={quantities[product.objectID] || 1}
                    id="quantity"
                    min={1}
                    onChange={(event) =>
                      handleQuantityChange(
                        product.objectID,
                        parseInt(event.target.value)
                      )
                    }
                  />
                  <button
                    type="submit"
                    disabled={isNotAvailable[product.objectID]}
                  >
                    Add to cart
                  </button>
                  {isNotAvailable[product.objectID] && <p>Not enough stock</p>}
                </form>
              </div>
            </article>
          ))}
        </section>
        <aside>
          <h2>Cart</h2>
          <div>
            {cartProducts.map((item) => (
              <div key={item.objectID}>
                <p>{item.name}</p>
                <p>{item.amount}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
