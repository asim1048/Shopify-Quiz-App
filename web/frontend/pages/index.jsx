import React, { useState, useEffect, useContext } from "react";
import { Text, DataTable, Button, Modal, TextField } from "@shopify/polaris";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

import { useAppBridge } from "@shopify/app-bridge-react";


//import { useAuthenticatedFetch } from "../hooks";
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { PublicContext } from '../context/PublicContext'

const Index = () => {
  let fetch = useAuthenticatedFetch();
  const {storeinfo, quizes, setQuizes, singleQuizDetail, setSingleQuizDetail } = useContext(PublicContext)

  const [showPublishModal, setPublishModal] = useState(false);
  const [showQuizSubmissionsModal, setShowQuizSubmissionsModal] = useState(false);
  const [quizSubmissions, setQuizSubmissions] = useState([]);

  console.log("quizSubmissionsquizSubmissions",quizSubmissions)


  const navigate = useNavigate();
  // console.log("firstQuiz",firstQuiz)



  const onPress = () => {
    navigate("/create-quiz");
  };


  const productRecommendation = (quiz) => {
    setSingleQuizDetail(quiz)
    navigate("/QuizDetail");

  };
  const publishQUiz = (quiz) => {
    setSingleQuizDetail(quiz)
    setPublishModal(true)
  };
  const editQuiz = (quiz) => {
    setSingleQuizDetail(quiz)
    navigate("/EditQuiz");

  };
  const getanalytics = async (quiz) => {
    setSingleQuizDetail(quiz)
    try {
      const request = await fetch("/api/quiz/shopQuizSubmissions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify({
          shopID:storeinfo.id,
          quizID: quiz?._id,
        })
      });

      const response = await request.json();
      if (response.status) {

        setQuizSubmissions(response.data)
        setShowQuizSubmissionsModal(true)

      }

    } catch (error) {
      console.error(error);
    }

  };
  const deleteQuiz = async (quiz) => {
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
      if (response.status) {

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
      const publishButton = index === 0 ? <Button variant="monochromePlain" onClick={() => publishQUiz(quiz)}>Publish</Button> : null;
      const analyticsButton = index === 0 ? <Button variant="monochromePlain" onClick={() => getanalytics(quiz)}>Analytics</Button> : null;
      const editButton = index === 0 ? <Button variant="monochromePlain" onClick={() => editQuiz(quiz)}>Edit</Button> : null;
      const deleteButton = index === 0 ? <Button variant="monochromePlain" onClick={() => deleteQuiz(quiz)}>Delete</Button> : null;

      return [
        quizName, // Quiz name (empty string for subsequent questions in the same quiz)
        question.title, // Question title
        question.type, // Question type
        < div style={{ display: 'flex', gap: '3px' }}>
          {detailButton}
          {publishButton}
          {analyticsButton}
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
        minHeight: "100vh",
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
          margin: '10px 10px',
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

      {/* Publish Quiz Details */}
      <Modal
        open={showPublishModal}
        onClose={() => setPublishModal(false)}
        title={`Publishing ${singleQuizDetail?.title} Quiz`}
      >
        <Modal.Section style={{ flexDirection: "column" }}>
          <p>Copy the Quiz ID and paste where you want to add in store front.</p>
          <div style={{ display: "flex", marginTop:'10px',gap:'10px',flexDirection:'column' }}>
            <TextField
              value={singleQuizDetail?._id}
              readOnly
            />
            <Button onClick={()=>{
               navigator.clipboard.writeText(singleQuizDetail?._id).then(() => {
                // Optionally, provide feedback to the user that the text was copied
              });
            
            }}>Copy Quiz ID</Button>
          </div>
        </Modal.Section>
      </Modal>
      {/*Quiz SubmissionsDetails */}
      <Modal
        open={showQuizSubmissionsModal}
        onClose={() => setShowQuizSubmissionsModal(false)}
        title={`Analytics: ${singleQuizDetail?.title} `}
      >
        <Modal.Section style={{ flexDirection: "column" }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Total Submissions: {quizSubmissions.length}</h3>
        </div>
        <div>
          {/* Render a list of submissions */}
          {quizSubmissions.map((submission, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
              <h4>Submission #{index + 1}</h4>
              <div>
                {/* Render qna for each submission */}
                {submission.qna.map((qa, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <p><strong>{qa.title}:</strong> {qa.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </Modal.Section>
      </Modal>

    </div>
  );
};

export default Index;
