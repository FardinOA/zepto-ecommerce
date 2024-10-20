// utils.js
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export function getWishlist() {
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
}

export function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

export function isBookInWishlist(bookId) {
    const wishlist = getWishlist();
    return wishlist.includes(bookId);
}

export function toggleWishlist(bookId) {
    let wishlist = getWishlist();
    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter((id) => id !== bookId);
    } else {
        wishlist.push(bookId);
    }
    saveWishlist(wishlist);
}
