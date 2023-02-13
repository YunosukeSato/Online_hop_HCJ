const table = document.querySelector("table");
const postTemplate = document.querySelector("template");
const totalPrice = document.querySelector(".total-price");

// Calc subtotal
let subtotal = 0;

async function sendHttpRequest(method, url, data) {
  return await fetch(url, {
    method,
    ...(data && { headers: { "Content-Type": "application/json" } }),
    ...(data && { body: JSON.stringify(data) }),
  }).then((r) => r.json());
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch all items from the cart
  fetchCart();

  // Delete item from cart
  table.addEventListener("click", function (e) {
    if (e.target.classList[2] == "delete") {
      const tr = e.target.parentNode.parentNode.parentNode;
      const item = document.getElementById(tr.id);
      deleteItem(tr.id);
      // Remove tbody of the deleted item
      item.remove();
    }
  });
});

async function fetchCart() {
  // Fetch all items in the cart
  const responseData = await sendHttpRequest(
    "GET",
    "http://localhost:8080/api/cart/items"
  );

  if (responseData.length > 0) {
    for (const item of responseData) {
      
      const postElClone = document.importNode(postTemplate.content, true);
      postElClone.querySelector("tr").setAttribute("id", item.id);
      postElClone.querySelector("td img").setAttribute("src", item.image);
      postElClone.querySelector(".name").textContent = item.name;
      postElClone.querySelector(".price").textContent = "$" + item.price;
      table.appendChild(postElClone);

      subtotal += item.price;
    }
  }

  totalPrice.textContent = "$" + subtotal;
}

async function deleteItem(id) {
  // Remove an item from the cart
  const responseData = await sendHttpRequest(
    "POST",
    "http://localhost:8080/api/cart/delete/item",
    { id: id }
  );

  console.log(responseData);
  subtotal -= responseData.price;
  totalPrice.textContent = "$" + subtotal;
}
