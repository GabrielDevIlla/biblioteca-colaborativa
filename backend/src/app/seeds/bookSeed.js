import { faker } from '@faker-js/faker/locale/pt_BR';
import instanciaPrisma from '../../connection/instance.js';

const prisma = instanciaPrisma.getConnection();

const editoras = [
    'Companhia das Letras', 'Record', 'Intrínseca', 'Rocco',
    'Planeta', 'Sextante', 'Darkside', 'Arqueiro', 'Alta Books', 'Novatec'
];

const statusOpcoes = ['DISPONIVEL', 'ALUGADO'];

async function createRandomBooks() {
    const seeds = [];

    for (let i = 1; i <= 20; i++) {
        seeds.push(
            prisma.livro.create({
                data: {
                    titulo: faker.lorem.words({ min: 2, max: 5 }),
                    autor: faker.person.fullName(),
                    dataLancamento: faker.date.between({ from: '1950-01-01', to: '2024-12-31' }),
                    editora: editoras[Math.floor(Math.random() * editoras.length)],
                    statusAluguel: statusOpcoes[Math.floor(Math.random() * statusOpcoes.length)],
                    quantidadeAlugada: faker.number.int({ min: 0, max: 150 }),
                }
            })
        );
    }

    await prisma.$transaction(seeds);
    console.log('✅ 20 livros de seed gerados com sucesso!');
}

createRandomBooks()
    .catch((e) => {
        console.error('❌ Erro ao gerar seeds:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
