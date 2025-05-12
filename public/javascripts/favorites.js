class FavoriteManager {
    constructor() {
        this.favoriteButtons = document.querySelectorAll('.favorite-button');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId;
                this.toggleFavorite(productId, button);
            });
        });
    }

    async toggleFavorite(productId, button) {
        try {
            const isFavorite = button.classList.contains('active');
            const method = isFavorite ? 'DELETE' : 'POST';
            
            const response = await fetch(`/api/favorites/${productId}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                button.classList.toggle('active');
                // Actualizar el contador de favoritos si existe
                const counter = document.querySelector('.favorites-counter');
                if (counter) {
                    const currentCount = parseInt(counter.textContent);
                    counter.textContent = isFavorite ? currentCount - 1 : currentCount + 1;
                }
                // Mostrar mensaje de éxito
                if (isFavorite) {
                    alert('Propiedad eliminada de favoritos correctamente');
                } else {
                    alert('Propiedad agregada a favoritos correctamente');
                }
            } else {
                const data = await response.json();
                console.error('Error:', data.error);
                alert(data.error || 'Error al actualizar favorito');
            }
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            alert('Error al actualizar favorito');
        }
    }

    async checkFavoriteStatus(productId, button) {
        try {
            const response = await fetch(`/api/favorites/check/${productId}`, {
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const { isFavorite } = await response.json();
                if (isFavorite) {
                    button.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Error al verificar estado de favorito:', error);
        }
    }
}

// Inicializar el manejador de favoritos cuando el DOM esté listo
// y verificar el estado inicial de los favoritos

document.addEventListener('DOMContentLoaded', () => {
    window.favoriteManager = new FavoriteManager();
    document.querySelectorAll('.favorite-button').forEach(button => {
        const productId = button.dataset.productId;
        favoriteManager.checkFavoriteStatus(productId, button);
    });
}); 