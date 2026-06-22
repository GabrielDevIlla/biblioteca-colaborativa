import instanciaPrisma from "../../connection/instance.js";

const prisma = instanciaPrisma.getConnection();

class userRepository{
    async findByEmail(email) {
        try {
            return await prisma.user.findUnique({ where: { email } });
        } catch (error) {
            console.log('Repository: Erro ao buscar email! ', error.message);
            return null;
        }
    }

    async createUser(data) {
        try {
            const userExists = await prisma.user.findUnique({where: {email: data.email}}); //procura o usuário pra ver se ja existe
            if (!userExists) {
                const {username, password, email, birthday, phone} = data;

                const create = prisma.user.create({
                    data: {
                        username,
                        password,
                        email,
                        birthday: new Date(birthday),
                        phone
                    }
                });
                
                return create
            } else {
                throw new Error('Repository: O email inserido já está em uso!')
            }

        } catch (error) {
            console.log('Repository: Erro no catch! ', error.message)
            // throw error;
        }
    }

    async showAllUsers() {
        try {
            const allUser = prisma.user.findMany();
            return allUser
        } catch (error) {
            console.log('Repository: Erro no cath! ', error.message)
        }
    }

    async updateUser(id, data) {
        try {
            const userExists = await prisma.user.findUnique({where: { id: Number(id) }}); //o Number é pra garantir que é um inteiro e não uma string
            if (!userExists) {
                throw new Error('Repository: ConflictError - Usuário não existe ')
            };

            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
            );

            const updateUser = prisma.user.update(
                {
                    where:{ id },
                    data: cleanData
                });
            return updateUser
        } catch (error) {
            console.log('Repository: Erro ao atualizar usuário! ', error.message);
            // throw error;
        }
    }


    async deleteUser(id) {
        try {
            const userExists = await prisma.user.findUnique({where: { id: Number(id) }}); //o Number é pra garantir que é um inteiro e não uma string
            if (!userExists) {
                throw new Error('Repository: ConflictError - Usuário não existe ')
            };

            await prisma.user.delete({where:{ id }});
            return {message: 'Usuário Deletado com sucesso!'}
            
        } catch (error) {
            console.log('Repository: Erro ao deletar usuário! ', error);
            // throw error
        }
    }

}

export default userRepository;