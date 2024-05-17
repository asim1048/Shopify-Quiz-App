import mongoose from 'mongoose'

const quizsubmissionSchema = mongoose.Schema({
    shopID:{
        type:Number,
    },
    quizID:{
        type: String,
    },
    qna:{
        type:Array,
        default:[]
    }
}, {
    timestamps: true
});

const quizsubmission = mongoose.model('quizsubmission', quizsubmissionSchema); 

export default quizsubmission;