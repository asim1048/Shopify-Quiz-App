import Question from "../Models/question.js";
import Quiz from '../Models/quiz.js'
export const addQuizz = async (req, res) => {
    try {
        const data = req.body;
        const images = req.files; // Uploaded images
        console.log("images", images)

        // Array to store question IDs
        const questionIds = [];
        let index = 0;

        for (let i = 0; i < data.questions?.length; i++) {
            const questionData = data?.questions[i];
            const options = []; // Array to store options with images

            for (let j = 0; j < questionData?.options?.length; j++) {
                const option = questionData?.options[j];
                let imagePath = null;

                // Check if the question type is SingleSelect or MultiSelect and if the option has an image
                if ((questionData.type == "SingleSelect" || questionData.type == "MultiSelect") ) {
                    
                    
                        imagePath = images[index].path;
                        index++;

                console.log("imagePath", imagePath)
                   
                }


                options.push({ id: j.toString(), value: option.value, image: imagePath });
            }

            // Create question
            const newQuestion = new Question({
                title: questionData.title,
                type: questionData.type,
                options: options
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
            message: "Quiz created successfully",
            data: newQuiz,
            images: req.files
        };
        return res.status(200).send(ress);
    } catch (error) {
        console.error(error);
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error
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
            port: PORT
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
