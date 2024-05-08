import mongoose from 'mongoose';


const URL = `mongodb+srv://asimsunskilltechs:x8LG1WQwKjQZJqGM@quiz.rt7i7lm.mongodb.net/?retryWrites=true&w=majority&appName=quiz`;

const Connection = async () => {
    try {
       await mongoose.connect(URL, {
           useNewUrlParser: true,
           // Add any additional options as needed
       });
       console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to database:", error);
    }
};

export default Connection;
