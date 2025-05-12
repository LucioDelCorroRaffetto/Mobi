class CommentManager {
    constructor(productId) {
        this.productId = productId;
        this.commentsContainer = document.querySelector('.comment-list');
        this.commentForm = document.querySelector('.comment-form');
        this.setupEventListeners();
        this.loadComments();
    }

    setupEventListeners() {
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitComment();
            });
        }
    }

    async loadComments() {
        try {
            const response = await fetch(`/api/comments/product/${this.productId}`, {
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const comments = await response.json();
                this.renderComments(comments);
            }
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        }
    }

    async submitComment() {
        const content = this.commentForm.querySelector('textarea').value;
        if (!content.trim()) return;

        try {
            const response = await fetch(`/api/comments/product/${this.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                this.commentForm.reset();
                this.loadComments();
            } else {
                const data = await response.json();
                console.error('Error:', data.error);
                alert(data.error || 'Error al enviar comentario');
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
            alert('Error al enviar comentario');
        }
    }

    async deleteComment(commentId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });

            if (response.ok) {
                this.loadComments();
            } else {
                const data = await response.json();
                console.error('Error:', data.error);
                alert(data.error || 'Error al eliminar comentario');
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar comentario');
        }
    }

    renderComments(comments) {
        if (!this.commentsContainer) return;
        
        this.commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${comment.usuario ? comment.usuario.nombre : 'Usuario'}${'     '}${comment.usuario ? comment.usuario.apellido : 'Apellido'}</span>
                    <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-content">${comment.contenido}</div>
                ${comment.usuario_id === window.currentUserId ? `
                    <div class="comment-actions">
                        <button class="delete-comment" onclick="commentManager.deleteComment(${comment.id})">
                            Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
}

// Inicializar el manejador de comentarios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const productIdElement = document.querySelector('[data-product-id]');
    if (productIdElement) {
        const productId = productIdElement.dataset.productId;
        window.commentManager = new CommentManager(productId);
    }
}); 