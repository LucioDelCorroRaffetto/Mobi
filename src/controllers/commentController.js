const { Comment, Usuario } = require('../database/models');

const commentController = {
    // Obtener comentarios de un producto
    getComments: async (req, res) => {
        try {
            const { productId } = req.params;
            const comments = await Comment.findAll({
                where: { propiedad_id: productId },
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido', 'imagen']
                }],
                order: [['created_at', 'DESC']]
            });
            res.json(comments);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            res.status(500).json({ error: 'Error al obtener los comentarios' });
        }
    },

    // Crear un nuevo comentario
    createComment: async (req, res) => {
        try {
            const { productId } = req.params;
            const { content } = req.body;
            const userId = req.session.user.id;

            if (!content || content.trim() === '') {
                return res.status(400).json({ error: 'El contenido del comentario no puede estar vacío' });
            }

            const comment = await Comment.create({
                propiedad_id: productId,
                usuario_id: userId,
                contenido: content.trim()
            });

            // Obtener el comentario con la información del usuario
            const commentWithUser = await Comment.findByPk(comment.id, {
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido', 'imagen']
                }]
            });

            res.status(201).json(commentWithUser);
        } catch (error) {
            console.error('Error al crear comentario:', error);
            res.status(500).json({ error: 'Error al crear el comentario' });
        }
    },

    // Eliminar un comentario
    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const userId = req.session.user.id;

            const comment = await Comment.findOne({
                where: {
                    id: commentId,
                    usuario_id: userId
                }
            });

            if (!comment) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
            }

            await comment.destroy();
            res.json({ message: 'Comentario eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            res.status(500).json({ error: 'Error al eliminar el comentario' });
        }
    }
};

module.exports = commentController; 