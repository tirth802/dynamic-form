const Form = require('../models/Form');

 const createForm = async (req, res) => {
    try {
        const { name, description, theme, settings, fields } = req.body;
        if (!name || !fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({ success: false, message: "Form name and fields are required" });
        }
        const formData = { name, fields };
        if (description) formData.description = description;
        if (theme) formData.theme = theme;
        if (settings) formData.settings = settings;

        const Forms = await Form.create(formData);
        res.status(201).json({ success: true, data: Forms, message: "Form created successfully" });
        console.log("Form created successfully:", Forms);
    } catch (error) {
        console.error("Error creating form:", error);
        res.status(500).json({ success: false, message: "Failed to create form" });
    }
}

const getForms = async (req, res) => {
    try {
        const forms = await Form.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: forms });
        console.log("Forms fetched successfully");
    } catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({ success: false, message: "Failed to fetch forms" });
    
    }
}

// single form logic
const getFromById = async(req,res)=>{
    try {
        const form = await Form.findById(req.params.id);
        if(!form){
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, data: form });    
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch form" });
    }
}

// PUT update form logic
const updateForm = async(req,res)=>{
    try {
        const { name, description, theme, settings, fields } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (theme !== undefined) updateData.theme = theme;
        if (settings !== undefined) updateData.settings = settings;
        if (fields !== undefined) updateData.fields = fields;

        const updatedForm = await Form.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedForm, message: "Form updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update form" }); 
    }
}

// Delete form logic 
const deleteForm = async(req,res)=>{
    try {
       const deletedForm = await Form.findByIdAndDelete(req.params.id);
         if(!deletedForm){
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, message: "Form deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete form" });
    }
}

module.exports = { createForm ,getForms,getFromById,updateForm,deleteForm};



