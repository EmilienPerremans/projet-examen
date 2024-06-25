const cart = JSON.parse(localStorage.getItem("cart")) || [];

function removeFromCart(articleId) {
    const index = cart.findIndex(item => item.id === articleId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartPage();
    }
}

function updateCartPage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();

    const cartContainer = document.getElementById("cartContainer");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='alert alert-info'>Votre panier est vide.</p>";
        return;
    }

    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered");

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Article</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Prix Total</th>
            <th>Secteur</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    cart.forEach(item => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = item.Nom;

        const quantityTd = document.createElement("td");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.classList.add("form-control");
        quantityInput.addEventListener("change", (event) => {
            item.quantity = parseInt(event.target.value);
            updateCartPage();
        });
        quantityTd.appendChild(quantityInput);

        const priceTd = document.createElement("td");
        priceTd.textContent = `${item.Prix.toFixed(2)} €`;

        const totalTd = document.createElement("td");
        totalTd.textContent = `${(item.quantity * item.Prix).toFixed(2)} €`;

        const secteurTd = document.createElement("td");
        secteurTd.textContent = item.Secteur;

        const actionTd = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.classList.add("btn", "btn-danger");
        removeButton.textContent = "Supprimer";
        removeButton.addEventListener("click", () => removeFromCart(item.id));
        actionTd.appendChild(removeButton);

        tr.appendChild(nameTd);
        tr.appendChild(quantityTd);
        tr.appendChild(priceTd);
        tr.appendChild(totalTd);
        tr.appendChild(secteurTd);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    cartContainer.appendChild(table);

    const totalAmount = cart.reduce((total, item) => total + item.quantity * item.Prix, 0);
    const totalAmountElement = document.createElement("p");
    totalAmountElement.classList.add("text-end", "fw-bold", "mt-3");
    totalAmountElement.textContent = `Total Général: ${totalAmount.toFixed(2)} €`;
    cartContainer.appendChild(totalAmountElement);
}

function updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

updateCartPage();
