import mongoose from 'mongoose'

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        require:true
    },
    type: {
        type:String,
        require:true,
    },
    image:{
        type:String,
    },
    options:{
        type:Array,
    }
}, {
    timestamps: true
});

const question = mongoose.model('question', questionSchema); 

export default question;