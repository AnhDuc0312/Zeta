import express from 'express';
import { CategoryController } from '../controllers/categoryController';
import { validateCategory, handleValidation } from '../controllers/categoryController';
const router = express.Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.get);
router.post('/', validateCategory, handleValidation, CategoryController.create);
router.put('/:id', validateCategory, handleValidation, CategoryController.update);
router.delete('/:id', CategoryController.remove);

export default router;
