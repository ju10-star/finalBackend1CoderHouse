export async function addToCart(pid) {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    const res = await fetch('/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const data = await res.json();
    cartId = data.payload._id;
    localStorage.setItem('cartId', cartId);
  }

  await fetch(`/api/carts/${cartId}/products/${pid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: 1 })
  });
  alert('Producto agregado al carrito');
}