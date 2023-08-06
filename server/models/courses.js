const mongoose = require('mongoose');

courseSchema = new mongoose.Schema({
    user: {
        type:String,
        required: true
    },
    courses: [
        {
        type: String,
        required: true,
            sections: [
                {
                    sectionName: {
                        type: String,
                        required: true
                    },
                    weight:{ 
                        type: Number,
                        required: true
                    },
                    grades: {
                        type: Array,
                        required: true
                    }
                }
            ]
        }
    ],
});

module.exports = mongoose.model('Course', courseSchema);