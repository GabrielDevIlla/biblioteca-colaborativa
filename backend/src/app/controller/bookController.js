import BookRepository from "../repository/bookRepository.js";

const bookRepository = new BookRepository();

class BookController {

    async createController(req, res) {
        try {
            const data = req.body;
            const camposObrigatorios = ['titulo', 'autor', 'dataLancamento', 'editora'];

            for (const campo of camposObrigatorios) {
                if (!data[campo]) {
                    return res.status(400).json({
                        message: `Campo obrigatório ausente: "${campo}"`
                    });
                }
            }

            const livro = await bookRepository.createBook(data);
            return res.status(201).json({ message: 'Livro cadastrado com sucesso!', data: livro });

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao cadastrar livro!',
                error: error.message
            });
        }
    }

    async showController(req, res) {
        try {
            const livros = await bookRepository.showAllBooks();
            return res.status(200).json(livros);
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao buscar livros!',
                error: error.message
            });
        }
    }

    async showByIdController(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);

            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            const livro = await bookRepository.showBookById(userId);
            return res.status(200).json(livro);

        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 500;
            return res.status(status).json({
                message: 'Erro ao buscar livro!',
                error: error.message
            });
        }
    }

    async updateController(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const livroId = parseInt(id, 10);

            if (isNaN(livroId)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            const livro = await bookRepository.updateBook(livroId, data);
            return res.status(200).json({ message: 'Livro atualizado com sucesso!', data: livro });

        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 500;
            return res.status(status).json({
                message: 'Erro ao atualizar livro!',
                error: error.message
            });
        }
    }

    async deleteController(req, res) {
        try {
            const { id } = req.params;
            const livroId = parseInt(id, 10);

            if (isNaN(livroId)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            const result = await bookRepository.deleteBook(livroId);
            return res.status(200).json(result);

        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 500;
            return res.status(status).json({
                message: 'Erro ao deletar livro!',
                error: error.message
            });
        }
    }
}

export default BookController;
