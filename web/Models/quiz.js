import mongoose from 'mongoose'

const quizSchema = mongoose.Schema({
    shopID:{
        type:Number,
    },
    shopName:{
        type: String,
    },
    title: {
        type: String,
    },
    questions: {
        type:Array,
        default:[]
    },
    status:{
        type:Boolean,
        default:true
    }
}, {
    timestamps: true
});

const quiz = mongoose.model('quiz', quizSchema); 

export default quiz;