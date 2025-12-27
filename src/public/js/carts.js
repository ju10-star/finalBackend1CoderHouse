export async function removeFromCart(cid, pid) {
  await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' });
  location.reload();
}

export async function emptyCart(cid) {
  await fetch(`/api/carts/${cid}`, { method: 'DELETE' });
  location.reload();
}