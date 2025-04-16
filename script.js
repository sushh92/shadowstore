document.addEventListener('DOMContentLoaded', function() {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const productsContainer = document.querySelector('.products-container');
    
    // Modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    // Function to get product price
    function getProductPrice(productCard) {
        const priceText = productCard.querySelector('.price').textContent;
        return parseFloat(priceText.replace('₹', '').replace(/,/g, ''));
    }

    // Function to parse search input
    function parseSearchInput(input) {
        const searchTerm = input.toLowerCase();
        const priceMatch = searchTerm.match(/under\s+(\d+)/);
        const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : Infinity;
        const searchWords = searchTerm.replace(/under\s+\d+/, '').trim();
        return { searchWords, maxPrice };
    }

    // Function to search products
    function searchProducts() {
        const { searchWords, maxPrice } = parseSearchInput(searchInput.value);

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productPrice = getProductPrice(card);
            const matchesSearch = searchWords === '' || productName.includes(searchWords);
            const matchesPrice = productPrice <= maxPrice;

            if (matchesSearch && matchesPrice) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Show message if no products found
        const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none');
        if (visibleProducts.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <h3>No products found</h3>
                <p>Try adjusting your search</p>
            `;
            
            // Remove existing no-results message if any
            const existingNoResults = document.querySelector('.no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }
            
            productsContainer.appendChild(noResults);
        } else {
            // Remove no-results message if products are found
            const existingNoResults = document.querySelector('.no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }
        }
    }

    // Add event listeners for search
    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Image gallery functionality
    productCards.forEach(card => {
        const gallery = card.querySelector('.image-gallery');
        const images = gallery.querySelectorAll('img');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        const quickViewBtn = card.querySelector('.quick-view');
        let currentIndex = 0;

        // Function to show image at specific index
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
        }

        // Next button click handler
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        // Previous button click handler
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        // Quick View button click handler
        quickViewBtn.addEventListener('click', () => {
            const activeImage = gallery.querySelector('img.active');
            if (activeImage) {
                modal.style.display = "block";
                modalImg.src = activeImage.src;
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });

        // Auto-advance images every 3 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 3000);
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}); 