import React, { useState, useContext } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';

import { PublicContext } from '../context/PublicContext';
import Header from "../components/Header";


function MyApp() {
  const navigate = useNavigate();
  let fetch = useAuthenticatedFetch();


  const { singleQuizDetail, setSingleQuizDetail, quizes, setQuizes } = useContext(PublicContext);
  const [openProductSelector, setOpenProductSelector] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [selectedOptionID, setSelectedOptionID] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const onPress = () => {
    navigate("/");
  };

  const renderOptions = (question) => {
    if (question.options) {
      return (
        <ul>
          {question.options.map((option) => (
            <li key={option?.id} style={{ marginBottom: '8px', fontSize: '16px', cursor: 'pointer' }}
              onClick={() => {
                setSelectedOptionID(option?.id);
                setSelectedQuestion(question);
                setSelectedProducts(option?.Products?.length > 0 ? option.Products : []);
                setOpenProductSelector(true);
              }}
            >
              {option.value}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const formattedSelectedProducts = selectedProducts.map(productId => ({ id: `gid://shopify/Product/${productId}` }));

  const updateQuestion = async (question) => {

    try {
      const request = await fetch("/api/quiz/updateQuestionOptions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify({
          id: question?._id, // Pass shopID directly in the request body
          options: question?.options
        })
      });

      const response = await request.json();

    } catch (error) {
      console.error(error);
    }

  }

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
      <Header buttonText={"Go Back"} callBackFunction={onPress} />
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', borderRadius: '8px', margin: '50px 10%',
        backgroundColor: '#4c7480'

      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '10px 20%',
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{singleQuizDetail.title}</h2>
          <h4 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: 'white', textAlign: 'center' }}>Question & answers <a style={{ fontWeight: '500' }}>( Click on answer text to link products )</a>
          </h4>

          {/* Render questions */}
          {singleQuizDetail?.questions.map((question) => {
            if (question.type !== "SimpleInputFields" && question.options) {
              return (
                <div style={{ marginBottom: '20px' }} >
                  <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{question.title}</h4>
                  {/* Render options based on question type */}
                  {renderOptions(question)}
                </div>
              );
            }
            // If the question type is "SimpleInputFields" or it doesn't have options, return null
            return null;
          })}
          {/* Resource picker for selecting products */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={openProductSelector ? "1" : '2'}>
            <ResourcePicker
              resourceType="Product"
              onCancel={() => setOpenProductSelector(false)}
              open={openProductSelector}
              initialSelectionIds={formattedSelectedProducts}
              showVariants={false}
              onSelection={(res) => {
                let selectedIds = res.selection.map(item => item.id);
                selectedIds = selectedIds.map(url => url.split('/').pop());

                const updatedOptions = selectedQuestion.options.map(option => {
                  if (option.id === selectedOptionID) {
                    return {
                      ...option,
                      Products: selectedIds
                    };
                  }
                  return option;
                });
                const updatedQuestion = { ...selectedQuestion, options: updatedOptions };
                const updatedQuizDetail = {
                  ...singleQuizDetail,
                  questions: singleQuizDetail.questions.map(question =>
                    question._id === selectedQuestion._id ? updatedQuestion : question
                  )
                };

                //Update Quizes
                const updatedQuizes = quizes?.map(quiz =>
                  quiz._id === singleQuizDetail._id ? updatedQuizDetail : quiz
                );

                //console.log('updatedQuestion',updatedQuestion)

                updateQuestion(updatedQuestion);

                setQuizes(updatedQuizes);
                setSingleQuizDetail(updatedQuizDetail);
                setOpenProductSelector(false);
              }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyApp;
