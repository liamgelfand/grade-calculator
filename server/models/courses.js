const mongoose = require('mongoose');

courseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    sections: [
        {
            sectionName: String,
            weight: Number,
            grades: Array
        }
    ]
});

module.exports = mongoose.model('Course', courseSchema);