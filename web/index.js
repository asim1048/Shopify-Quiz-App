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

import { addQuizz,shopQuizes,getShopFirstQuiz,quizanswersBaseProductIDS } from './Controllers/quiz-controller.js';
import { updateQuestionOptions } from "./Controllers/question-controller.js";

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
app.post("/quizzes/answersBaseProductIDS", quizanswersBaseProductIDS);


app.post('/api/quiz/addQuizz', QuestionPic.array('images'), addQuizz);
app.post('/api/quiz/shopQuizes', shopQuizes);
app.post('/api/quiz/getShopFirstQuiz', getShopFirstQuiz);
app.post('/api/quiz/updateQuestionOptions', updateQuestionOptions);

//Read Store/Shop info
app.get("/api/store/info", async(_req,res)=>{
  
  let storeInfo=await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  })
  
  res.status(200).send(storeInfo);
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