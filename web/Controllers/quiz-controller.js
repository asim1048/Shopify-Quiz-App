import Question from "../Models/question.js";
import Quiz from '../Models/quiz.js'
export const addQuizz = async (req, res) => {
    try {
        const data = req.body;
        // Array to store question IDs
        const questionIds = [];

        //images
        const images = req.files;

        let index = 0;

        // Iterate over each question data and corresponding image (if available)
        for (let i = 0; i < data.questions.length; i++) {
            const questionData = data.questions[i];
            let imagePath = null; // Set imagePath to null by default


            // Check if the question has an image
            if (questionData.hasImage) {
                // Check if there are images available and the index is within bounds
                if (images && images[index]) {
                    imagePath = images[index].path;
                    index++;
                }
            }

            // Create question
            const newQuestion = new Question({
                title: questionData.title,
                type: questionData.type,
                image: imagePath, // Associate image with the question
                options: questionData.options
            });

            // Save question to database
            const savedQuestion = await newQuestion.save();

            // Push question ID to array
            questionIds.push(savedQuestion._id.toString());
        }


        // Create quiz and associate question IDs
        const newQuiz = new Quiz({
            shopID: data.shopID,
            shopName: data.shopName,
            title: data.quizTitle,
            questions: questionIds
        });

        // Save quiz to database
        await newQuiz.save();

        let ress = {
            status: true,
            message: "Quiz created successfullyyyyy",
            data: newQuiz,
            images: req.files
        };
        return res.status(200).send(ress);
    } catch (error) {
        console.log(error);
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).send(ress);
    }
}
export const shopQuizes = async (req, res) => {
    try {

        const { shopID } = req.body;

        // Fetch quizzes based on shopID
        const quizzes = await Quiz.find({ shopID });

        // Manually populate the questions array with question documents
        for (const quiz of quizzes) {
            const populatedQuestions = await Promise.all(
                quiz.questions.map(async (questionId) => {
                    return await Question.findById(questionId);
                })
            );
            quiz.questions = populatedQuestions;
        }
        let ress = {
            status: true,
            message: "QUiz Fetched successfully",
            data: quizzes

        };
        return res.status(200).send(ress);
    } catch (error) {
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).send(ress);
    }
}
export const getShopFirstQuiz = async (req, res) => {
    try {
        const { shopID } = req.body;
        const PORT = parseInt(
            process.env.BACKEND_PORT || process.env.PORT || "3000",
            10
          );

        // Fetch the first quiz based on shopID
        const quiz = await Quiz.findOne({ shopID });

        if (!quiz) {
            // If no quiz found, return appropriate response
            let ress = {
                status: false,
                message: "No quiz found for the shopID",
            };
            return res.status(404).send(ress);
        }

        // Populate the questions array with question documents
        const populatedQuestions = await Promise.all(
            quiz.questions.map(async (questionId) => {
                return await Question.findById(questionId);
            })
        );
        quiz.questions = populatedQuestions;

        

        let ress = {
            status: true,
            message: "Quiz fetched successfully",
            data: quiz,
            port:PORT
        };
        return res.status(200).send(ress);
    } catch (error) {
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).send(ress);
    }
}
