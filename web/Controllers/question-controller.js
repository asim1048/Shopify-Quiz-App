import Question from "../Models/question.js";
export const updateQuestionOptions = async (request, response) => {
    try {
        const { id,options} = request.body;

        const question = await Question.findById(id);



        if (!question) {
            let res = {
                status: false,
                message: "Question not found"
            };
            return response.status(200).json(res);
        }
        question.options = options;
        
        await question.save();

        let res = {
            status: true,
            message: "Question options updated successfully",
            data: question
        };

        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}