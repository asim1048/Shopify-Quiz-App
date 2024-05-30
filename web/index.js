// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import path from 'path';
import { fileURLToPath } from 'url';

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import  Connection  from './Database/db.js';

import QuestionPic from './Middleware/Question.js';
import { host } from "./host/index.js";
import Question from "./Models/question.js";
import Quiz from './Models/quiz.js'
import Quizsubmission from "./Models/quizsubmission.js";
import Session from "./Models/sessions.js";


import { addQuizz,shopQuizes,quizDetail,getShopFirstQuiz,quizanswersBaseProductIDS,deleteQuiz,takeCodeAndDisplay,updateQuiz } from './Controllers/quiz-controller.js';
import { updateQuestionOptions } from "./Controllers/question-controller.js";
import { shopQuizSubmissions,sendResultsEmail } from "./Controllers/quizsubmission-controller.js";
import { addorUpdateSession } from "./Controllers/session-controller.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/questionData/*", authenticateUser);
async function authenticateUser(req,res,next){
  let shop=req.query.shop;
  let storename=await shopify.config.sessionStorage.findSessionsByShop(shop)
  if(shop===storename[0].shop){
    next();
  }else{
    res.send("User Not Authorized")
  }
 }
 

app.use(express.json());
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

app.get("/quizzes/info",async(req,res)=>{
  res.status(200).json({messge:'sent data'})
})
app.post("/quizzes/firstQuiz", getShopFirstQuiz);
app.post("/quizzes/quizDetail", quizDetail);
app.post("/quizzes/answersBaseProductIDS", async(req,res)=>{
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

    //-----------Before common-------------------
  //   const populatedQuestions = await Promise.all(
  //     quiz.questions.map(async (questionId) => {
  //         return await Question.findById(questionId);
  //     })
  // );
  // quiz.questions = populatedQuestions;

  // let productIDs = [];
  // selectedOptions?.forEach(option => {
  //     const question = populatedQuestions?.find(q => q?._id == option?.questionId);
  //     if (question && question?.options && question?.options?.length > 0) {
  //         const selectedOption = question?.options.find(opt => opt?.value == option?.value);
  //             selectedOption?.Products?.forEach(product => {
  //                 productIDs.push(product);
  //             });
          
  //     }
  // });
  // productIDs = [...new Set(productIDs)];


    //-----------Adding common-------------------
    const populatedQuestions = await Promise.all(
      quiz.questions.map(async (questionId) => {
          return await Question.findById(questionId);
      })
  );
  quiz.questions = populatedQuestions;
  
  let productArrays = [];
  selectedOptions?.forEach(option => {
      const question = populatedQuestions?.find(q => q?._id == option?.questionId);
      if (question && question?.options && question?.options?.length > 0) {
          const selectedOption = question?.options.find(opt => opt?.value == option?.value);
          if (selectedOption && selectedOption?.Products) {
              productArrays.push(selectedOption.Products);
          }
      }
  });
  
  // Function to find the intersection of multiple arrays
  function getIntersection(arrays) {
      return arrays.reduce((acc, array) => acc.filter(value => array.includes(value)), arrays[0] || []);
  }
  
  const productIDs = getIntersection(productArrays);
  
  console.log(productIDs);

    //finding session
    let shopSession = await Session.findOne({ shopID: shopID });
    
    if(productIDs?.length>0){
    let productsData=await shopify.api.rest.Product.all({
      session: shopSession?.session,
      ids: productIDs.join(',')
    })
    


    let ress = {
        status: true,
        message: "Quiz fetched successfully",
        data: productIDs,
        products:productsData?.data
    };
    return res.status(200).send(ress);
    }
    else {
      let ress = {
        status: true,
        message: "Quiz fetched successfully",
        data: productIDs,
        products:[]
    };
    return res.status(200).send(ress);
    }
} catch (error) {
    console.log(error)
    let ress = {
        status: false,
        message: "Something went wrong in the backend",
        error: error,
    };
    return res.status(500).send(ress);
}
});
// app.post("/quizzes/answersBaseProductIDS", quizanswersBaseProductIDS);
app.post("/quizzes/sendResultsEmail", sendResultsEmail);


app.post('/api/quiz/addQuizz', QuestionPic.array('images'), addQuizz);
app.post('/api/quiz/updateQuiz', QuestionPic.array('images'), updateQuiz);
app.post('/api/quiz/shopQuizes', shopQuizes);
app.post('/api/quiz/getShopFirstQuiz', getShopFirstQuiz);
app.post('/api/quiz/updateQuestionOptions', updateQuestionOptions);
app.post('/api/quiz/deleteQuiz', deleteQuiz);
app.post('/api/quiz/shopQuizSubmissions', shopQuizSubmissions);
app.post('/api/quiz/addorUpdateSession', addorUpdateSession);

app.get('/api/quiz/getHost',async(req,res)=>{
  let ress = {
    status: true,
    message: "Quiz fetched successfully",
    data: `${host}`
};
return res.status(200).send(ress);
} );

//Read Store/Shop info
app.get("/api/store/info", async(_req,res)=>{
  
  let storeInfo=await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  })
  
  res.status(200).send({storeInfo,session:res.locals.shopify.session});
})

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

Connection()


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));