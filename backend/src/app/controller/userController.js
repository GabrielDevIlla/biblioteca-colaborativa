import userRepository from "../repository/userRepository.js";

const {createUser, showAllUsers, updateUser, deleteUser, findByEmail} = new userRepository();


class userController{
    async loginController(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
            }

            const user = await findByEmail(email);

            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Email ou senha inválidos!' });
            }

            const { password: _, ...userData } = user;
            return res.status(200).json({ message: 'Login realizado com sucesso!', user: userData });

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao fazer login!',
                error: error.message
            });
        }
    }

    async createController(req, res) {
        try {
            const data = req.body;
            if (data.birthday) {
                data.birthday = new Date(data.birthday);
            }

            if (!data.username || !data.password || !data.email || !data.birthday) {
                return res.status(400).json({message: 'Parâmetros insuficientes para criar usuário!'})
            }

            const emailRegex = /^[^\s@]+@grupoilla\.com\.br$/;
            if (!emailRegex.test(data.email)) {
                return res.status(400).json({ message: 'Apenas emails institucionais @grupoilla.com.br são permitidos!' });
            }

            const user = await createUser(data);
            const { password: _, ...userData } = user;
            res.status(200).json({message: 'Usuário criado!', user: userData})
            
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao criar usuário!',
                error: error.message
            });
        }
    }

    async showController(req, res) {
        try {
            const user = await showAllUsers();
            res.json(user)    
        } catch (error) {
            res.status(500).json({
                message: 'Controller: Erro ao acessar a tabela!',
                error: error.message
            })
            // console.error(error);
        }
    }

    async updateController(req, res) {
        try {
            const {id} = req.params;
            const data = req.body;
            const userId = parseInt(id, 10); //parseInt para garantir que é um número e não uma string
            
            if (isNaN(userId)) {
                return res.status(400).json({message: 'ID inválido!'});
            };

            if (data.email) {
                const emailRegex = /^[^\s@]+@grupoilla\.com\.br$/;
                if (!emailRegex.test(data.email)) {
                    return res.status(400).json({ message: 'Apenas emails institucionais @grupoilla.com.br são permitidos!' });
                }
            }

            const user = await updateUser(userId, data); 

            res.status(200).json({message: 'Usuário atualizado!', user})
        } catch (error) {
            res.status(500).json({
                message: 'Controller: Erro ao atualizar usuário!',
                error: error.message
            })
        }
    }

    async deleteController(req, res) {
        try {
            const {id} = req.params;
            if (id === null || id === undefined) {
                return res.status(400).json({message: 'Não foi possivel deletar o usuário! ID Obrigatório.'})
            };
            const result = await deleteUser(parseInt(id));
            res.status(200).json(result.message) //message é necessario para q o front entenda que deu certo

        } catch (error) {
            res.status(500).json({
                message: 'Controller: Erro ao deletar usuário!',
                error: error.message
            })
        }
    }
}

export default userController;