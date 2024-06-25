document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get("id"));
    const articles = JSON.parse(localStorage.getItem("articles"));
    const article = articles.find(art => art.id === articleId);
    
    if (article) {
        const articleDetails = document.getElementById("articleDetails");

        const col = document.createElement("div");
        col.classList.add("col-md-12");

        const articleElement = document.createElement("div");
        articleElement.classList.add("card");
        articleElement.style.width = "100%";

        const imageElement = document.createElement("img");
        imageElement.src = article.Image;
        imageElement.classList.add("card-img-top");

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
        articleDetails.appendChild(col);
    }
});

function addToCart(article) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === article.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...article, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function getSecteurDescription(nom) {
    const secteurs = JSON.parse(localStorage.getItem("secteurs"));
    const secteur = secteurs.find(sect => sect.Nom === nom);
    return secteur ? secteur.Description : "Secteur non spécifié";
}
