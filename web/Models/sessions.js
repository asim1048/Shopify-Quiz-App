import mongoose from 'mongoose'

const sessionsSchema = mongoose.Schema({
    shopID:{
        type:Number,
    },
    session:{
        type:Object,
        default:{}
    }
}, {
    timestamps: true
});

const session = mongoose.model('session', sessionsSchema); 

export default session;