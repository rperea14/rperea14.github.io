/**
 * Filter & Search for Projects and Publications
 */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const items = document.querySelectorAll('.filterable-card');

    if (items.length === 0) return;

    let currentCategory = 'all';
    let currentQuery = '';

    function applyFilters() {
        items.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            const textContent = item.textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || category.includes(currentCategory);
            const matchesQuery = !currentQuery || textContent.includes(currentQuery);

            if (matchesCategory && matchesQuery) {
                item.style.display = 'block';
                item.style.animation = 'fadeInSlide 0.3s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }
}
