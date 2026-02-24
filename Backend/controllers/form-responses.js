
const FormResponse = require("../models/Form-responses");

const createFormResponse = async (req, res) => {
    try {
        const { formId, answers } = req.body;   
        if (!formId || !answers) {
            return res.status(400).json({ success: false, message: "formId and answers are required" });
        } 
        const response = await FormResponse.create({ formId, answers });
        res.status(201).json({ success: true, data: response, message: "Form response created successfully" });
    } catch (error) {
        console.error("Error creating form response:", error);
        res.status(500).json({ success: false, message: "Failed to create form response" });
    }
}

const getFormResponses = async (req, res) => {
    try {
       const responses = await FormResponse.find({formId: req.params.formId});
       res.status(200).json({ success: true, data: responses });
    } catch (error) {
        console.error("Error fetching form responses:", error);
        res.status(500).json({ success: false, message: "Failed to fetch form responses" });
    }
}

// Single response logic
const getFormResponseById = async (req, res) => {
    try {
        const response = await FormResponse.findById(req.params.id);    
        if (!response) {
            return res.status(404).json({ success: false, message: "Form response not found" });
        }       
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Error fetching form response:", error);
        res.status(500).json({ success: false, message: "Failed to fetch form response" });
    }
}

//PUT update response logic
const updateFormResponse = async (req, res) => {
    try {
        const { answers } = req.body;   
        const updatedResponse = await FormResponse.findByIdAndUpdate(
            req.params.id,
            { answers },    
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedResponse, message: "Form response updated successfully" });
    } catch (error) {
        console.error("Error updating form response:", error);
        res.status(500).json({ success: false, message: "Failed to update form response" });
    }
}

// Delete response logic
const deleteFormResponse = async (req, res) => {
    try {
        const deletedResponse = await FormResponse.findByIdAndDelete(req.params.id);
        if (!deletedResponse) {
            return res.status(404).json({ success: false, message: "Form response not found" });
        }
        res.status(200).json({ success: true, message: "Form response deleted successfully" });
    } catch (error) {
        console.error("Error deleting form response:", error);
        res.status(500).json({ success: false, message: "Failed to delete form response" });
    }
}

module.exports = {
    createFormResponse,
    getFormResponses,
    getFormResponseById,
    updateFormResponse,
    deleteFormResponse
}