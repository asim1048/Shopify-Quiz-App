import Session from "../Models/sessions.js";

export const addorUpdateSession = async (req, res) => {
    try {
        const { shopID, session } = req.body;

        // Find the session for the specified shopID
        let shopSession = await Session.findOne({ shopID: shopID });

        if (shopSession) {
            // If session exists for the shop, update it
            shopSession.session = session;
            await shopSession.save();

            return res.status(200).json({
                status: true,
                message: 'Shop session updated successfully ',
                data: shopSession,
            });
        } else {
            // If no session found for the shopID, create a new session
            const newSession = new Session({ shopID: shopID, session: session });
            await newSession.save();

            return res.status(200).json({
                status: true,
                message: 'Shop session created successfully ',
                data: newSession,
            });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong in the backend',
            error: error.message,
        });
    }
};
