// wishlist.js
import { getWishlist, isBookInWishlist, toggleWishlist } from "./utils.js";

export function showSkeletons(id) {
    const booksContainer = document.getElementById(id);
    booksContainer.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.className =
            "bg-gray-200 animate-pulse rounded-lg overflow-hidden p-4";
        skeletonCard.innerHTML = `
            <div class="mb-4 bg-gray-300 h-56 w-full rounded"></div>
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded mb-1"></div>
            <div class="h-4 bg-gray-300 rounded"></div>
        `;
        booksContainer.appendChild(skeletonCard);
    }
}

async function fetchAndRenderWishlist() {
    try {
        showSkeletons("wishlist-container");
        const wishlist = getWishlist();
        if (wishlist.length === 0) {
            document.getElementById("wishlist-container").innerHTML =
                "<p>Your wishlist is empty.</p>";
            return;
        }

        let apiUrl = `https://gutendex.com/books`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const books = data?.results?.filter((book) =>
            wishlist.includes(`${book.id}`)
        );
        renderCard(books);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        document.getElementById("wishlist-container").innerHTML =
            "<p>Failed to load your wishlist.</p>";
    }
}

function renderCard(books) {
    const wishlistContainer = document.getElementById("wishlist-container");
    wishlistContainer.innerHTML = "";
    books.forEach((book) => {
        const { id, title, authors, subjects, formats } = book;
        const authorName = authors.length ? authors[0].name : "Unknown Author";
        const genre = subjects.length ? subjects[0] : "Unknown Genre";

        const bookCard = document.createElement("div");
        bookCard.className =
            "relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-4";
        bookCard.setAttribute("data-book-id", id);
        bookCard.innerHTML = `
            <div class="mb-4">
                <img loading="lazy" src="${formats["image/jpeg"]}" alt="${title}" class="w-full h-56 object-cover">
            </div>
            <h3 class="text-xl font-semibold mb-2 line-clamp-1">${title}</h3>
            <p class="text-gray-600 mb-1">Author: <span class="font-medium">${authorName}</span></p>
            <p class="text-gray-600 mb-1">Genre: <span class="font-medium">${genre}</span></p>
            <button class="remove-wishlist-button size-9 rounded-full text-primary absolute top-2 right-2" data-book-id="${id}">
                <i class="ri-heart-fill"></i> 
            </button>
        `;
        wishlistContainer.appendChild(bookCard);
    });

    // Add click event listeners to the remove buttons
    const removeButtons = document.querySelectorAll(".remove-wishlist-button");
    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bookId = button.getAttribute("data-book-id");
            toggleWishlist(bookId);
            animateAndRemoveCard(bookId);
        });
    });
}

// Animation for removing the card
function animateAndRemoveCard(bookId) {
    const card = document.querySelector(`[data-book-id="${bookId}"]`);
    if (card) {
        card.classList.add("fade-out");
        card.addEventListener("animationend", () => {
            card.remove();
            // Check if the wishlist is empty after removal
            const wishlist = getWishlist();
            if (wishlist.length === 0) {
                document.getElementById("wishlist-container").innerHTML =
                    "<p>Your wishlist is empty.</p>";
            }
        });
    }
}

// Add fade-out animation styles
const style = document.createElement("style");
style.innerHTML = `
    .fade-out {
        animation: fadeOut 0.5s forwards;
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);

// Initialize the wishlist page
document.addEventListener("DOMContentLoaded", () => fetchAndRenderWishlist());
