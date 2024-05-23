import Question from "../Models/question.js";
import Quiz from '../Models/quiz.js'
import Quizsubmission from "../Models/quizsubmission.js";

import {host} from '../host/index.js'
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
        let newQuiz = new Quiz({
            shopID: data.shopID,
            shopName: data.shopName,
            title: data.quizTitle,
            questions: questionIds
        });

        // Save quiz to database
        await newQuiz.save();

        const populatedQuestions = await Promise.all(
            newQuiz.questions.map(async (questionId) => {
                return await Question.findById(questionId);
            })
        );
        newQuiz.questions = populatedQuestions;


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
            host:`${host}:${PORT}`
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
export const quizDetail = async (req, res) => {
    try {
        const { quizId } = req.body;
        const PORT = parseInt(
            process.env.BACKEND_PORT || process.env.PORT || "3000",
            10
        );

        // Fetch the first quiz based on shopID
        const quiz = await Quiz.findById( quizId );

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
            host:`${host}`
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

export const quizanswersBaseProductIDS = async (req, res) => {
    try {
        const { shopID,QuizID,selectedOptions,qna } = req.body;
        
        // Create Submission of Quiz
        const newQuizSubmissiin = new Quizsubmission({
            shopID: shopID,
            quizID: QuizID,
            qna: qna
        });

        await newQuizSubmissiin.save();


        // Fetch the first quiz based on shopID
        const quiz = await Quiz.findById( QuizID );

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

        let productIDs = [];
        selectedOptions?.forEach(option => {
            const question = populatedQuestions?.find(q => q?._id == option?.questionId);
            if (question && question?.options && question?.options?.length > 0) {
                const selectedOption = question?.options.find(opt => opt?.value == option?.value);
                    selectedOption?.Products?.forEach(product => {
                        productIDs.push(product);
                    });
                
            }
        });
        productIDs = [...new Set(productIDs)];


        let ress = {
            status: true,
            message: "Quiz fetched successfully",
            data: productIDs
        };
        return res.status(200).send(ress);
    } catch (error) {
        console.log(error)
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).send(ress);
    }
}
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.body;

        // Fetch the quiz based on ID
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            // If no quiz found, return appropriate response
            let ress = {
                status: false,
                message: "No quiz found for the given ID",
            };
            return res.status(404).send(ress);
        }

        // Delete all questions associated with the quiz
        await Promise.all(
            quiz.questions.map(async (questionId) => {
                return await Question.findByIdAndDelete(questionId);
            })
        );

        // Delete the quiz
        await Quiz.findByIdAndDelete(id);

        let ress = {
            status: true,
            message: "Quiz and associated questions deleted successfully",
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
};

export const takeCodeAndDisplay = async (req, res) => {
    try {
        const { shopID } = req.body;

        console.log("Cameeeeeeeee",shopID);
        let ress = {
            status: true,
            message: "Quiz fetched successfully",
            data: "<p>ALLAH o AKBAR</p>"
        };
        return res.status(200).send(ress);
    } catch (error) {
        console.log(error)
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).send(ress);
    }
}
export const updateQuiz = async (req, res) => {
    try {
        const { quizID, quizTitle, questions } = req.body;
        const images = req.files; // Uploaded images
        let imageIndex = 0;

        // Find and update the quiz title
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(200).send({ status: false, message: "Quiz not found" });
        }
        quiz.title = quizTitle;

        // Create a set of incoming question IDs for easy comparison
        const incomingQuestionIds = new Set(questions.map(q => q._id));

        // Identify and remove questions that are not in the incoming question list
        const existingQuestions = await Question.find({ _id: { $in: quiz.questions } });
        for (const existingQuestion of existingQuestions) {
            if (!incomingQuestionIds.has(existingQuestion._id.toString())) {
                // Remove the question from the database
                await Question.findByIdAndDelete(existingQuestion._id);
            }
        }

        // Update or create each question
        const updatedQuestionIds = [];
        for (let i = 0; i < questions?.length; i++) {
            const questionData = questions[i];
            const options = [];

            for (let j = 0; j < questionData?.options?.length; j++) {
                const option = questionData.options[j];
                let imagePath = option?.image;

                // Check if there's a new image for this option
                if (option?.newImage) {
                    imagePath = images[imageIndex].path;
                    imageIndex++;
                }

                options.push({ id: j.toString(), value: option.value, image: option?.newImage ? imagePath : option.image, Products:option?.Products });
            }

            // Find and update the question or create a new one if it doesn't exist
            let question;
            if (questionData?._id) {
                question = await Question.findById(questionData?._id);
                if (question) {
                    question.title = questionData.title;
                    question.options = options;
                    await question.save();
                } else {
                    // If the question ID is provided but not found, create a new question
                    question = new Question({ title: questionData.title, type: questionData.type, options: options });
                    await question.save();
                }
            } else {
                // If the question is new (no _id), create it
                question = new Question({ title: questionData.title, type: questionData.type, options: options });
                await question.save();
            }

            updatedQuestionIds.push(question._id);
        }

        // Update the quiz with the new list of questions
        quiz.questions = updatedQuestionIds;
        await quiz.save();

        const populatedQuestions = await Promise.all(
            quiz.questions.map(async (questionId) => {
                return await Question.findById(questionId);
            })
        );
        quiz.questions = populatedQuestions;

        return res.status(200).send({ status: true, message: "Quiz updated successfully", data: quiz });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: "Something went wrong", error });
    }
};
