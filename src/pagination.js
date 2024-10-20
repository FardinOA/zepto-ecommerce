// pagination.js
export function setupPagination({
    paginationContainer,
    currentPage,
    totalPages,
    onPageChange,
}) {
    paginationContainer.innerHTML = "";

    const maxVisibleButtons = 5;
    if (totalPages <= maxVisibleButtons + 2) {
        for (let i = 1; i <= totalPages; i++) {
            addPageButton(i);
        }
    } else {
        addPageButton(1);
        if (currentPage > 3) addEllipsis();
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            addPageButton(i);
        }
        if (currentPage < totalPages - 2) addEllipsis();
        addPageButton(totalPages);
    }

    paginationContainer.prepend(
        createNavButton("Previous", currentPage === 1, () =>
            onPageChange(currentPage - 1)
        )
    );
    paginationContainer.append(
        createNavButton("Next", currentPage === totalPages, () =>
            onPageChange(currentPage + 1)
        )
    );

    function addPageButton(page) {
        const pageButton = document.createElement("button");
        pageButton.className =
            "px-3 py-1 border rounded" +
            (page === currentPage ? " bg-primary text-white" : "");
        pageButton.textContent = page;
        pageButton.addEventListener("click", () => onPageChange(page));
        paginationContainer.appendChild(pageButton);
    }

    function addEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.className = "px-2";
        ellipsis.textContent = "...";
        paginationContainer.appendChild(ellipsis);
    }

    function createNavButton(text, isDisabled, onClick) {
        const button = document.createElement("button");
        button.className = "px-3 py-1 border rounded";
        button.textContent = text;
        button.disabled = isDisabled;
        button.addEventListener("click", onClick);
        return button;
    }
}
