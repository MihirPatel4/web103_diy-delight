import express from 'express';
import carControllers from '../controllers/carControllers';

const router = express.Router();

router.get('/', carControllers.getAllCars);
router.get('/:id', carControllers.getCar);
router.post('/', carControllers.createCar);
router.patch('/:id', carControllers.editCar);
router.delete('/:id', carControllers.deleteCar);

export default router;