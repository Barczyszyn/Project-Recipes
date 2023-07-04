import express from 'express';
const router = express.Router();
import RecipeController from '../controllers/RecipeController.js';
import checkAuth from '../helpers/auth.js';

router.get('/add', checkAuth, RecipeController.createRecipe);
router.post('/add', checkAuth, RecipeController.createRecipeSave);
router.get('/update/:id', checkAuth, RecipeController.updateRecipe);
router.post('/update', checkAuth, RecipeController.updateRecipeSave);
router.get('/dashboard', checkAuth, RecipeController.dashboard);
router.post('/remove', RecipeController.removeRecipe);
router.get('/', RecipeController.startPage);

export default router;