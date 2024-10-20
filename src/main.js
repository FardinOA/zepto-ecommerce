// main.js
import { setupPagination } from "./pagination.js";
import {
    debounce,
    getWishlist,
    saveWishlist,
    isBookInWishlist,
    toggleWishlist,
} from "./utils.js";

let currentPage = 1;
let totalPages = 1;

export async function fetchBooks(searchTerm = "", genre = "", page = 1) {
    try {
        showSkeletons("books-container");
        let apiUrl = `https://gutendex.com/books?search=${encodeURIComponent(
            searchTerm
        )}&page=${page}`;

        if (genre) {
            apiUrl += `&topic=${encodeURIComponent(genre)}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        totalPages = Math.ceil(data.count / 32);

        appendBooks(data.results);
        setupPagination({
            paginationContainer: document.getElementById("pagination"),
            currentPage,
            totalPages,
            onPageChange: (page) => {
                currentPage = page;
                fetchBooks(searchTerm, genre, page);
            },
        });
        updateWishlistUI();
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

function updateWishlistUI() {
    const wishlistButtons = document.querySelectorAll(".wishlist-button");

    wishlistButtons.forEach((button) => {
        const bookId = button.getAttribute("data-book-id");
        if (isBookInWishlist(bookId)) {
            button.innerHTML = '<i class="ri-heart-fill"></i>';
        } else {
            button.innerHTML = '<i class="ri-heart-line"></i>';
        }
    });
}

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

function appendBooks(books) {
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = "";

    books.forEach((book) => {
        const { id, title, authors, subjects, formats } = book;
        const authorName = authors.length ? authors[0].name : "Unknown Author";
        const genre = subjects.length ? subjects[0] : "Unknown Genre";

        const bookCard = document.createElement("div");
        bookCard.className =
            "relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-4";
        bookCard.innerHTML = `
           <a href="book-details.html?id=${id}" class="block">
                <div class="mb-4">
                    <img loading="lazy" src="${formats["image/jpeg"]}" alt="${title}" class="w-full h-56 object-cover">
                </div>
                <h3 class="text-xl font-semibold mb-2 line-clamp-1">${title}</h3>
                <p class="text-gray-600 mb-1">Author: <span class="font-medium">${authorName}</span></p>
                <p class="text-gray-600 mb-1">Genre: <span class="font-medium">${genre}</span></p>
            </a>
            <button class="remove-wishlist-button size-9 rounded-full text-primary absolute top-2 right-2" data-book-id="${id}">
                <i class="ri-heart-fill"></i>
            </button>
        `;
        booksContainer.appendChild(bookCard);
    });

    const wishlistButtons = document.querySelectorAll(".wishlist-button");
    wishlistButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bookId = button.getAttribute("data-book-id");
            toggleWishlist(bookId);
            button.querySelector("i").className = isBookInWishlist(bookId)
                ? "ri-heart-fill"
                : "ri-heart-line";
        });
    });
}

document.getElementById("search-input").addEventListener(
    "input",
    debounce((event) => {
        currentPage = 1;
        fetchBooks(
            event.target.value.trim(),
            document.getElementById("genre-dropdown").value,
            currentPage
        );
    }, 300)
);

document.getElementById("genre-dropdown").addEventListener("change", () => {
    currentPage = 1;
    fetchBooks(
        document.getElementById("search-input").value.trim(),
        document.getElementById("genre-dropdown").value,
        currentPage
    );
});

document.addEventListener("DOMContentLoaded", () => fetchBooks());
