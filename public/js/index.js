const socket = io();

function render(data) {
  const html = data
    .map((prod, index) => {
      return `<li class="productTitle">${prod.title} 
          <ul class="productDesc">
            <li>Descripción: ${prod.description}</li>
            <li>Precio: ${prod.price}</li>
            <li>Stock: ${prod.stock}</li>
            <li>Código: ${prod.code}</li>
            <li>Categoría: ${prod.category}</li>
            <li>Id: ${prod.id}</li>
          </ul>
      </li>
          `;
    })
    .join(" ");
  document.getElementById("productList").innerHTML = html;
}

socket.on("productList", (data) => {
  render(data);
});

function uploadProduct() {
  let product = {
    title: document.getElementById("prodTitle").value,
    description: document.getElementById("prodDesc").value,
    price: parseInt(document.getElementById("prodPrice").value),
    status: true,
    stock: parseInt(document.getElementById("prodStock").value),
    code: document.getElementById("prodCode").value,
    category: document.getElementById("prodCategory").value,
  };
  socket.emit("newProduct", product);
}

function eraseProduct(){
  let id = parseInt(document.getElementById("deletedProdId").value)
  socket.emit("eraseProduct", id);
}