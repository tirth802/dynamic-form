const express = require('express');
const router = express.Router();
const { createForm, getForms, getFromById, updateForm, deleteForm } = require('../controllers/formController');

router.post('/', createForm);
router.get('/',getForms)
router.get('/:id',getFromById)
router.put('/:id',updateForm)
router.delete('/:id',deleteForm)
module.exports = router;