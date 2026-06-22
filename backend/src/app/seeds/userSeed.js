import {faker} from '@faker-js/faker';
import instanciaPrisma from '../../connection/instance.js';

const prisma = instanciaPrisma.getConnection()

async function createRandomUser() {

    const seeds = []
    
    for (let i = 1; i <= 20; i++) {
        seeds.push(
            prisma.user.create({
                data: {
                    username: faker.person.fullName(),
                    password: faker.string.numeric(8),
                    email: faker.internet.email(),
                    birthday: faker.date.birthdate(),
                    phone: faker.phone.number({style: "national"}),
                    createdAt: faker.date.recent(),
                    updatedAt: faker.date.recent()
                }
            })
        )
        
    }
    await prisma.$transaction(seeds);
    console.log("Registros de seeds gerados com sucesso!");
};

createRandomUser()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect()
    })