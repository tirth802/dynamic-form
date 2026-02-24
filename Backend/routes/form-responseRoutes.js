const express = require('express');
const { createFormResponse, getFormResponses, getFormResponseById, updateFormResponse, deleteFormResponse } = require('../controllers/form-responses');
const router = express.Router();

router.post('/', createFormResponse);
router.get('/form/:formId', getFormResponses);
router.get('/:id', getFormResponseById);
router.put('/:id', updateFormResponse);
router.delete('/:id', deleteFormResponse);

module.exports = router; 