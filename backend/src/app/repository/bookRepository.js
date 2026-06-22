import instanciaPrisma from "../../connection/instance.js";

const prisma = instanciaPrisma.getConnection();

class BookRepository {

    async createBook(data) {
        const livroExists = await prisma.livro.findFirst({
            where: {
                titulo: data.titulo,
                autor: data.autor
            }
        });

        if (livroExists) {
            throw new Error('Repository: Já existe um livro com este título e autor cadastrado!');
        }

        const livro = await prisma.livro.create({
            data: {
                titulo: data.titulo,
                autor: data.autor,
                dataLancamento: new Date(data.dataLancamento),
                editora: data.editora,
                statusAluguel: data.statusAluguel ?? 'DISPONIVEL',
                quantidadeAlugada: data.quantidadeAlugada ?? 0,
            }
        });

        return livro;
    }

    async showAllBooks() {
        const livros = await prisma.livro.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return livros;
    }

    async showBookById(id) {
        const livro = await prisma.livro.findUnique({
            where: { id: Number(id) }
        });

        if (!livro) {
            throw new Error('Repository: Livro não encontrado!');
        }

        return livro;
    }

    async updateBook(id, data) {
        const livroExists = await prisma.livro.findUnique({
            where: { id: Number(id) }
        });

        if (!livroExists) {
            throw new Error('Repository: Livro não encontrado!');
        }

        // Remove campos vazios ou nulos para não sobrescrever dados existentes
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );

        // Converte a data caso venha no body
        if (cleanData.dataLancamento) {
            cleanData.dataLancamento = new Date(cleanData.dataLancamento);
        }

        const livroAtualizado = await prisma.livro.update({
            where: { id: Number(id) },
            data: cleanData
        });

        return livroAtualizado;
    }

    async deleteBook(id) {
        const livroExists = await prisma.livro.findUnique({
            where: { id: Number(id) }
        });

        if (!livroExists) {
            throw new Error('Repository: Livro não encontrado!');
        }

        await prisma.livro.delete({ where: { id: Number(id) } });
        return { message: 'Livro deletado com sucesso!' };
    }
}

export default BookRepository;
