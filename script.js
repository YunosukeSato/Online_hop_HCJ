const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");
const proContainer = document.querySelector(".pro-container");
const pro = document.getElementsByClassName("pro");
const postTemplate = document.querySelector("template");

async function sendHttpRequest(method, url, data) {
  return await fetch(url, {
    method,
    ...(data && { headers: { "Content-Type": "application/json" } }),
    ...(data && { body: JSON.stringify(data) }),
  }).then((r) => r.json());
}

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch all items
  fetchItems();

  proContainer.addEventListener("click", function (e) {
    e.preventDefault();

    // Add an item to the cart
    if (e.target.classList[1] == "cart") {
      const proId = e.target.parentNode.parentNode.id;

      addToCart(proId);
    }
  });
});

async function fetchItems() {
  const responseData = await sendHttpRequest(
    "GET",
    "http://localhost:8080/api/items/all"
  );

  console.log(responseData);
  if (responseData.length > 0) {
    for (const item of responseData) {
      const postElClone = document.importNode(postTemplate.content, true);
      postElClone.querySelector("div.pro").setAttribute("id", item.id);
      postElClone.querySelector("img").setAttribute("src", item.image);
      postElClone.querySelector(".brand").textContent = item.brand;
      postElClone.querySelector("h5").textContent = item.name;
      postElClone.querySelector("h4").textContent = "$" + item.price;
      proContainer.appendChild(postElClone);
    }
  }
}

async function addToCart(id) {
  // Fetch an item by its id
  const responseData = await sendHttpRequest(
    "POST",
    "http://localhost:8080/api/items/id",
    { id: id }
  );

  // Add the item to the cart
  const result = await sendHttpRequest(
    "POST",
    "http://localhost:8080/api/items/add/cart",
    {
      brand: responseData.brand,
      name: responseData.name,
      image: responseData.image,
      price: responseData.price,
    }
  );
  // console.log(result);
}


