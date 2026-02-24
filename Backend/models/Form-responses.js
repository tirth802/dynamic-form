const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true,
        },
        answers: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

    
module.exports = mongoose.model("FormResponse", FormResponseSchema);