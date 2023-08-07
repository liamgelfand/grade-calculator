const mongoose = require('mongoose');

courseSchema = new mongoose.Schema({
    user: String,
    courses: [
        {
            courseName: String,
            sections: [
                {
                    sectionName: String,
                    weight: Number,
                    grades: Array,
                    finalGrade: Number
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Course', courseSchema);