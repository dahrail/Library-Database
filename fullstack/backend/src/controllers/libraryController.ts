export class LibraryController {
    constructor(private libraryService: any) {}

    async borrowItem(req: any, res: any) {
        const { itemId, userId } = req.body;
        try {
            const result = await this.libraryService.borrowItem(itemId, userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async returnItem(req: any, res: any) {
        const { itemId, userId } = req.body;
        try {
            const result = await this.libraryService.returnItem(itemId, userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async requestItem(req: any, res: any) {
        const { itemId, userId } = req.body;
        try {
            const result = await this.libraryService.requestItem(itemId, userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getItems(req: any, res: any) {
        try {
            const items = await this.libraryService.getItems();
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}