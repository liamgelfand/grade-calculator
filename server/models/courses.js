const mongoose = require('mongoose');

courseSchema = new mongoose.Schema({
    user: String,
    courses: [
        {
            courseName: String,
            sections: [
                {
                    sectionName: String,
                    weight: String,
                    grades: String,
                    finalGrade: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Course', courseSchema);