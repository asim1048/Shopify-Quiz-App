import React, { useState, useEffect } from "react";
import { Text,DataTable } from "@shopify/polaris";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';
import {useAppBridge} from "@shopify/app-bridge-react";


//import { useAuthenticatedFetch } from "../hooks";
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { host } from "../host";
const Index = () => {
  let fetch = useAuthenticatedFetch();
 
  const [storeinfo, setStoreInfo] = useState({});
  const [firstQuiz, setFirstQuiz] = useState({});
  const [quizes, setQuizes] = useState([]);
  const [port,setPort]=useState(8000)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const request = await fetch("/api/store/info");
        const response = await request.json();
        setStoreInfo(response?.data[0]);
        fetchQuizes(response?.data[0]?.id)
        fetchFirstQuiz(response?.data[0]?.id)

      } catch (error) {
        console.error(error);
      }
    };
    const fetchQuizes = async (id) => {
      try {
        const request = await fetch("/api/quiz/shopQuizes", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Specify JSON content type
          },
          body: JSON.stringify({
            shopID: id // Pass shopID directly in the request body
          })
        });

        const response = await request.json();
        setQuizes(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
    const fetchFirstQuiz = async (id) => {
      try {
        const request = await fetch("/api/quiz/getShopFirstQuiz", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Specify JSON content type
          },
          body: JSON.stringify({
            shopID: id // Pass shopID directly in the request body
          })
        });

        const response = await request.json();
        setFirstQuiz(response?.data);
        setPort(response?.port)
      } catch (error) {
        console.error(error);
      }
    }

    fetchStoreInfo()
  }, []);

  const onPress = () => {
    navigate("/create-quiz");
  };


  const rows = quizes.flatMap(quiz => {
    // Create an array to store rows for each quiz
    const quizRows = quiz.questions.map((question, index) => {
      // For the first question in the quiz, include the quiz name
      const quizName = index === 0 ? quiz.title : '';
  
      return [
        quizName, // Quiz name (empty string for subsequent questions in the same quiz)
        question.title, // Question title
        question.type, // Question type
        new Date(question.createdAt).toLocaleString(), // Question created at
      ];
    });
  
    return quizRows;
  });
  
  

  const headings = ['Quiz Name', 'Question Title', 'Question Type', 'Created At'];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#353535",
        height: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <Header buttonText={"Create Quiz"} callBackFunction={onPress} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px 20%',
      }}>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text']}
          headings={headings}
          rows={rows}
        />
      </div>
      {firstQuiz?.questions?.length>0 && (
      <img
      src={`${host}:${port}/${firstQuiz?.questions[0]?.image}`} 
      style={{height:'300px', width:'400px', borderRadius:"10px"}}
      />
    )}

    </div>
  );
};

export default Index;
