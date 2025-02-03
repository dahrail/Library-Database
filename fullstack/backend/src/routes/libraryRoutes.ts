import { Router } from 'express';
import LibraryController from '../controllers/libraryController';

const router = Router();
const libraryController = new LibraryController();

export function setLibraryRoutes(app) {
    app.use('/api/library', router);

    router.post('/borrow', libraryController.borrowItem);
    router.post('/return', libraryController.returnItem);
    router.post('/request', libraryController.requestItem);
    router.get('/items', libraryController.getItems);
}