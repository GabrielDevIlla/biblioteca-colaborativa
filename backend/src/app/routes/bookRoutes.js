import express from 'express';
import BookController from "../controller/bookController.js";
import { requireAdmin } from "../middleware/authorization.js";

const bookRoutes = express.Router();
const controller = new BookController();

bookRoutes.post('/cadastrar', requireAdmin, controller.createController);
bookRoutes.get('/buscarTodos', controller.showController);
bookRoutes.get('/buscar/:id', controller.showByIdController);
bookRoutes.patch('/atualizar/:id', requireAdmin, controller.updateController);
bookRoutes.delete('/deletar/:id', requireAdmin, controller.deleteController);

export default bookRoutes;
