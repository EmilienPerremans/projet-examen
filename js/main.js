import "/styles.scss";
import nomVente from '/data/enVente.json';
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

const articles = nomVente.produits;
const categories = nomVente.catégories;
const secteurs = nomVente.secteur;

localStorage.setItem("articles", JSON.stringify(articles));
localStorage.setItem("categories", JSON.stringify(categories));
localStorage.setItem("secteurs", JSON.stringify(secteurs));

const app = document.getElementById("app");

const articlesContainer = document.createElement("div");
articlesContainer.classList.add("container", "py-4");
app.appendChild(articlesContainer);

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = 1;
const itemsPerPage = 2;

function updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(article) {
    const existingItem = cart.find(item => item.id === article.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...article, quantity: 1 });
    }
    updateCart();
}

function openCartModal() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBody = document.getElementById("cartModalBody");

    cartBody.innerHTML = "";
    if (cart.length === 0) {
        cartBody.innerHTML = "<p>Votre panier est vide.</p>";
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

        const itemInfo = document.createElement("div");
        itemInfo.innerHTML = `<strong>${item.Nom}</strong> - ${item.quantity} x ${item.Prix.toFixed(2)} € <br> Secteur: ${item.Secteur}`;

        const removeButton = document.createElement("button");
        removeButton.classList.add("btn", "btn-danger");
        removeButton.textContent = "Supprimer";
        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
            openCartModal();
        });

        cartItem.appendChild(itemInfo);
        cartItem.appendChild(removeButton);
        cartBody.appendChild(cartItem);
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.Prix * item.quantity, 0);
    const totalElement = document.createElement("div");
    totalElement.innerHTML = `<strong>Total: ${totalPrice.toFixed(2)} €</strong>`;
    cartBody.appendChild(totalElement);
}

function removeFromCart(articleId) {
    const index = cart.findIndex(item => item.id === articleId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}

function getSecteurDescription(nom) {
    const secteur = secteurs.find(sect => sect.Nom === nom);
    return secteur ? secteur.Description : "Secteur non spécifié";
}

function displayArticles(articlesToDisplay, page = 1) {
    articlesContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedArticles = articlesToDisplay.slice(start, end);

    for (let i = 0; i < paginatedArticles.length; i++) {
        const row = document.createElement("div");
        row.classList.add("row", "mb-4");

        const article = paginatedArticles[i];

        const col = document.createElement("div");
        col.classList.add("col-md-12");

        const articleElement = document.createElement("div");
        articleElement.classList.add("card");
        articleElement.style.width = "100%";

        const imageElement = document.createElement("img");
        imageElement.src = article.Image;
        imageElement.classList.add("card-img-top");
        imageElement.addEventListener("click", () => {
            window.location.href = `article.html?id=${article.id}`;
        });

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const titleElement = document.createElement("h5");
        titleElement.classList.add("card-title");
        titleElement.textContent = article.Nom;

        const priceElement = document.createElement("p");
        priceElement.classList.add("card-text");
        priceElement.textContent = `Prix: ${article.Prix} €`;

        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("card-text");
        descriptionElement.textContent = article.Description;

        const categoryElement = document.createElement("p");
        categoryElement.classList.add("card-text");

        const category = categories.find(cat => cat.Nom === article.Catégorie);
        categoryElement.textContent = category ? `Catégorie: ${category.Nom}` : "Catégorie non spécifiée";

        const secteurElement = document.createElement("p");
        secteurElement.classList.add("card-text");
        secteurElement.textContent = `Secteur: ${article.Secteur}`;

        const secteurDescriptionElement = document.createElement("p");
        secteurDescriptionElement.classList.add("card-text");
        secteurDescriptionElement.textContent = getSecteurDescription(article.Secteur);

        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("btn", "btn-primary");
        addToCartButton.textContent = "Ajouter au panier";
        addToCartButton.addEventListener("click", () => addToCart(article));

        cardBody.appendChild(titleElement);
        cardBody.appendChild(priceElement);
        cardBody.appendChild(descriptionElement);
        cardBody.appendChild(categoryElement);
        cardBody.appendChild(secteurElement);
        cardBody.appendChild(secteurDescriptionElement);
        cardBody.appendChild(addToCartButton);

        articleElement.appendChild(imageElement);
        articleElement.appendChild(cardBody);

        col.appendChild(articleElement);
        row.appendChild(col);

        articlesContainer.appendChild(row);
    }

    updatePagination(articlesToDisplay.length, page);
}

function updatePagination(totalItems, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item", i === currentPage ? "active" : "");
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click", (event) => {
            event.preventDefault();
            displayArticles(articles, i);
        });
        pagination.appendChild(li);
    }
}

function sortArticles(criteria) {
    let sortedArticles = [...articles];

    if (criteria === 'name') {
        sortedArticles.sort((a, b) => a.Nom.localeCompare(b.Nom));
    } else if (criteria === 'price') {
        sortedArticles.sort((a, b) => a.Prix - b.Prix);
    } else if (criteria === 'category') {
        sortedArticles.sort((a, b) => a.Catégorie.localeCompare(b.Catégorie));
    } else if (criteria === 'sector') {
        sortedArticles.sort((a, b) => a.Secteur.localeCompare(b.Secteur));
    }

    displayArticles(sortedArticles, currentPage);
}

// Afficher les articles par défaut
displayArticles(articles, currentPage);

const sortOptions = document.getElementById("sortOptions");
sortOptions.addEventListener("change", (event) => {
    const criteria = event.target.value;
    sortArticles(criteria);
});

// Ajout du bouton du panier
const cartButton = document.getElementById("cartButton");
if (cartButton) {
    cartButton.addEventListener("click", openCartModal);
}

updateCartDisplay();
