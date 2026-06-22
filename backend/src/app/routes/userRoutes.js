import express from 'express';
import userController from "../controller/userController.js";

const userRoutes = express.Router();
const controller = new userController;

userRoutes.post('/cadastrar', controller.createController);
userRoutes.post('/login', controller.loginController);
userRoutes.get('/buscarTodos', controller.showController);
userRoutes.patch('/atualizarUsuario/:id', controller.updateController);
userRoutes.delete('/deletarUsuario/:id', controller.deleteController);

export default userRoutes;