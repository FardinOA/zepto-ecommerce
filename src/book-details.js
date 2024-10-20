// book-details.js

async function fetchBookDetails(bookId) {
    try {
        const apiUrl = `https://gutendex.com/books/${bookId}`;
        const response = await fetch(apiUrl);
        const book = await response.json();
        renderBookDetails(book);
    } catch (error) {
        console.error("Error fetching book details:", error);
        document.getElementById("book-details").innerHTML =
            "<p class='text-red-500'>Failed to load book details.</p>";
    }
}

function renderBookDetails(book) {
    const { title, authors, subjects, formats, download_count } = book;
    const authorName = authors.length ? authors[0].name : "Unknown Author";
    const genres = subjects.length ? subjects.join(", ") : "Unknown Genre";
    const coverImage =
        formats["image/jpeg"] || "https://via.placeholder.com/300";

    const bookDetailsContainer = document.getElementById("book-details");
    bookDetailsContainer.innerHTML = `
        <img src="${coverImage}" alt="${title}" class="w-full max-w-xs mx-auto rounded-lg mb-6 shadow-md">
        <h1 class="text-2xl font-bold text-center mb-2">${title}</h1>
        <p class="text-lg text-gray-600 text-center mb-4">by ${authorName}</p>
        <div class="text-left">
            <h3 class="text-xl font-semibold mb-2">Genres:</h3>
            <p class="mb-4">${genres}</p>
            <h3 class="text-xl font-semibold mb-2">Downloads:</h3>
            <p class="mb-4">${download_count.toLocaleString()} times</p>
        </div>
        <div class="text-left mt-6">
            <h3 class="text-xl font-semibold mb-2">Available Formats:</h3>
            <div class="flex flex-wrap gap-2">
                ${renderDownloadLinks(formats)}
            </div>
        </div>
    `;
}

function renderDownloadLinks(formats) {
    const formatTypes = {
        "text/html": "Read Online",
        "application/epub+zip": "Download EPUB",
        "application/x-mobipocket-ebook": "Download MOBI",
        "text/plain; charset=us-ascii": "Download Text",
    };

    return Object.keys(formats)
        .filter((key) => formatTypes[key])
        .map(
            (key) =>
                `<a href="${formats[key]}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" target="_blank">${formatTypes[key]}</a>`
        )
        .join("");
}

document.addEventListener("DOMContentLoaded", () => {
    // Get the book ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (bookId) {
        fetchBookDetails(bookId);
    } else {
        document.getElementById("book-details").innerHTML =
            "<p class='text-red-500'>Book ID not found in the URL.</p>";
    }
});
