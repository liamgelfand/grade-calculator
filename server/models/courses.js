const mongoose = require('mongoose');

courseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    grades: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Course', courseSchema);