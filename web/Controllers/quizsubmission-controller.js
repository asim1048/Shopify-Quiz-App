import Quizsubmission from "../Models/quizsubmission.js";

export const shopQuizSubmissions = async (req, res) => {
    try {
        const { shopID,quizID } = req.body;

        // Find all rescue bags for the specified restaurant
        const shopQuizSubmissions = await Quizsubmission.find({ shopID:shopID, quizID:quizID });
        
        return res.status(200).json({
            status: true,
            message: 'Shop quiz submission retrived successfully ',
            data: shopQuizSubmissions,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Something went wrong in the backend',
            error: error.message,
        });
    }
};