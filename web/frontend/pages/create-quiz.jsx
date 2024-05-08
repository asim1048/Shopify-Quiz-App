import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Modal, Text } from "@shopify/polaris";
//import { useAuthenticatedFetch } from "../hooks";
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';


import { questionsType } from "../data/data";
import Header from "../components/Header";
import SingleSelectQuestion from "../components/Questions/SingleSelectQuestion";
import MultiSelectQuestion from "../components/Questions/MultiSelectQuestion";
import SimpleInputFieldQuestion from "../components/Questions/SimpleInputFieldQuestion";
import RadioButtonQuestion from "../components/Questions/RadioButtonQuestion";

const Index = () => {
  let fetch = useAuthenticatedFetch();

  const navigate = useNavigate();


  const [storeinfo, setStoreInfo] = useState({});
  const [quizTitle, setQuizTitle] = useState("");
  const [openQuestionModal, setQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  //console.log("storeinfo", storeinfo)

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const request = await fetch("/api/store/info");
        const response = await request.json();
        setStoreInfo(response?.data[0]);
      } catch (error) {
        console.error(error);
      }
    };




    fetchStoreInfo()
  }, []);

  const onPress = async () => {
    // Check if every question has a title with length greater than 1 and if image is added for SingleSelect and MultiSelect questions
    const invalidQuestion = questions.find((question, index) => {
      if (question.title.length < 2) {
        alert(`Please provide a valid title for question ${index + 1}.`);
        return true;
      }

      // Check if the question type is SingleSelect or MultiSelect
      if (question.type === "SingleSelect" || question.type === "MultiSelect") {
        // Check if an image is added for each option
        const missingImage = question.options.some(option => !option.image);
        if (missingImage) {
          alert(`Please add an image for all options in question ${index + 1}.`);
          return true;
        }
      }

      return false;
    });

    // Check if every option within each question has a value with length greater than 1
    const invalidOption = questions.find((question, questionIndex) => {
      if (question.type !== "SimpleInputFields") {
        const invalidOptionIndex = question.options?.findIndex((option) => option.value.length < 2);
        if (invalidOptionIndex !== -1) {
          alert(`Please provide a valid value for option ${invalidOptionIndex + 1} in question ${questionIndex + 1}.`);
          return true;
        }
      }
      return false;
    });

    if (invalidQuestion || invalidOption) {
      return; // Stop further actions if any validation fails
    }
    try {
      const formData = new FormData();

      // Add quiz data to form data
      formData.append('shopID', storeinfo.id);
      formData.append('shopName', storeinfo.name);
      formData.append('quizTitle', quizTitle);

      questions.forEach((question, index) => {
        formData.append(`questions[${index}][title]`, question.title);
        formData.append(`questions[${index}][type]`, question.type);

        // Append options along with their images
        question?.options?.forEach((option, optionIndex) => {
          formData.append(`questions[${index}][options][${optionIndex}][value]`, option.value);
          // Check if the option has an image and add it to the images array
          if (option.image) {
            formData.append('images', option.image);
          }
        });

        // Append a flag to indicate if the question has an image
        formData.append(`questions[${index}][hasImage]`, !!question.image); // Convert to boolean
      });

      const request = await fetch("/api/quiz/addQuizz", {
        method: "POST",
        body: formData
      });


      const response = await request.json();
      //console.log(response);
      if (response.status) {
        navigate("/");
      }
      else {
        alert(response?.message)
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleQuestionTypeSelection = (question) => {

    if (question.shortForm == "SingleSelect") {
      // Add single select question to the singleSelectQuestions state
      setQuestions([
        ...questions,
        {
          type: question.shortForm,
          title: "",
          options: [{ id: Date.now(), value: "" }], // Add an empty option
        },
      ]);

    }
    else if (question.shortForm == "MultiSelect") {
      // Add single select question to the singleSelectQuestions state
      setQuestions([
        ...questions,
        {
          type: question.shortForm,
          title: "",
          options: [{ id: Date.now(), value: "" }], // Add an empty option
        },
      ]);
    }
    else if (question.shortForm == "SimpleInputFields") {
      // Add single select question to the singleSelectQuestions state
      setQuestions([
        ...questions,
        {
          type: question.shortForm,
          title: "",
        },
      ]);

    }
    else if (question.shortForm == "radioButton") {
      // Add single select question to the singleSelectQuestions state
      setQuestions([
        ...questions,
        {
          type: question.shortForm,
          title: "",
          options: [{ id: Date.now(), value: "" }], // Add an empty option
        },
      ]);
    }
    // Close the modal
    setQuestionModal(false);
  };
  const renderQuestionComponent = (question, index) => {
    switch (question.type) {
      case "SingleSelect":
        return <SingleSelectQuestion question={question} setQuestions={setQuestions} index={index} />;
      case "MultiSelect":
        return <MultiSelectQuestion question={question} setQuestions={setQuestions} index={index} />;
      case "SimpleInputFields":
        return <SimpleInputFieldQuestion question={question} setQuestions={setQuestions} index={index} />;
      case "radioButton":
        return <RadioButtonQuestion question={question} setQuestions={setQuestions} index={index} />; default:
        return null;
    }
  };
  const deleteQuestion = (index) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1); // Remove the question at the specified index
      return updatedQuestions;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#353535",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <Header buttonText={"Submit Quiz"} callBackFunction={onPress} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px 20%",
          gap: "20px",
        }}
      >
        <Text alignment="center" variant="heading2xl" as="h3">Quiz Creation</Text>

        <div>
          <Text variant="bodyLg" as="h3">Quiz Title</Text>
          <TextField
            value={quizTitle}
            placeholder="Enter title here..."
            onChange={(newValue) => setQuizTitle(newValue)}
          />
        </div>
        {/* Render the questions */}
        {questions.map((question, index) => (
          <div key={index}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <Text variant="headingMd" as="h3">Question {index + 1}</Text>
              <Button variant="secondary" style={{ verticalAlign: 'middle' }} onClick={() => deleteQuestion(index)}>❌</Button>

            </div>
            {renderQuestionComponent(question, index)}
          </div>
        ))}


        <Button primary onClick={() => setQuestionModal(true)}>
          Add A Question
        </Button>
      </div>

      {/* Question Type Picker Modal */}
      <Modal
        open={openQuestionModal}
        onClose={() => setQuestionModal(false)}
        title="Select a Question Type"
      >
        <Modal.Section style={{ flexDirection: "column" }}>
          <p>Choose the type of question you want to add:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {questionsType.map((question) => (
              <Button key={question.id} variant="secondary" size="large" onClick={() => handleQuestionTypeSelection(question)}>
                {question.title}
              </Button>
            ))}
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default Index;


