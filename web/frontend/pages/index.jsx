import React, { useState, useEffect, useContext } from "react";
import { Text, DataTable,Button } from "@shopify/polaris";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

import { useAppBridge } from "@shopify/app-bridge-react";


//import { useAuthenticatedFetch } from "../hooks";
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { PublicContext } from '../context/PublicContext'
import EditQuiz from "./EditQuiz";

const Index = () => {
  let fetch = useAuthenticatedFetch();
  const {quizes,setQuizes,setSingleQuizDetail}=useContext(PublicContext)

  const navigate = useNavigate();
  // console.log("firstQuiz",firstQuiz)

  

  const onPress = () => {
    navigate("/create-quiz");
  };


  const productRecommendation = (quiz) => {
    setSingleQuizDetail(quiz)
        navigate("/QuizDetail");

  };
  const editQuiz = (quiz) => {
    setSingleQuizDetail(quiz)
        navigate("/EditQuiz");

  };
  const deleteQuiz = async(quiz) => {
    try {
      const request = await fetch("/api/quiz/deleteQuiz", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify({
          id: quiz?._id,
        })
      });
    
      const response = await request.json();
      if(response.status){

        setQuizes(prevQuizes => prevQuizes.filter(q => q._id != quiz._id));
       
      }
      
    } catch (error) {
      console.error(error);
    }

  };

  const rows = quizes.flatMap(quiz => {
    // Create an array to store rows for each quiz
    const quizRows = quiz.questions.map((question, index) => {
        // For the first question in the quiz, include the quiz name and detail button
        const quizName = index === 0 ? quiz.title : '';
        const detailButton = index === 0 ? <Button primary onClick={() => productRecommendation(quiz)}>Product Recommendations</Button> : null;
        const editButton = index === 0 ? <Button variant="monochromePlain" onClick={() => editQuiz(quiz)}>Edit</Button> : null;
        const deleteButton = index === 0 ? <Button variant="monochromePlain" onClick={() => deleteQuiz(quiz)}>Delete</Button> : null;

        return [
            quizName, // Quiz name (empty string for subsequent questions in the same quiz)
            question.title, // Question title
            question.type, // Question type
            < div style={{display:'flex',gap:'5px'}}>
                {detailButton}
                {editButton}
                {deleteButton}
            </div> // Detail and Delete buttons (only for the first question)
        ];
    });

    return quizRows;
});


  const headings = ['Quiz Name', 'Question Title', 'Question Type', "Actions"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        height: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <Header buttonText={"Create Quiz"} callBackFunction={onPress} />
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', borderRadius: '8px', margin: '50px 10%',
        backgroundColor: '#4c7480'

      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '10px 10%',
        }}>
          <Text alignment="center" variant="heading4xl" as="h3">Quizes</Text>
          <div style={{ marginTop: '10px' }}></div>
          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text']}
            headings={headings}
            rows={rows}
          />
        </div>
      </div>
      {/* {firstQuiz?.questions?.length>0 && (
      <img
      src={`${host}/${firstQuiz?.questions[1].options[3]?.image}`} 
      style={{height:'300px', width:'400px', borderRadius:"10px"}}
      />
    )} */}

    </div>
  );
};

export default Index;
