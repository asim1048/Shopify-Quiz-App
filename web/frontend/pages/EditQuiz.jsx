import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { TextField, Button, Modal, Text } from "@shopify/polaris";

import { PublicContext } from '../context/PublicContext';
import { questionsType } from "../data/data";

import Header from "../components/Header";

import SingleSelectQuestion from "../components/EditQuiz/SingleSelectQuestion";
import MultiSelectQuestion from "../components/EditQuiz/MultiSelectQuestion";
import SimpleInputFieldQuestion from "../components/EditQuiz/SimpleInputFieldQuestion";
import RadioButtonQuestion from "../components/EditQuiz/RadioButtonQuestion";


function EditQuiz() {
  const navigate = useNavigate();
  let fetch = useAuthenticatedFetch();


  const { singleQuizDetail, setSingleQuizDetail, quizes, setQuizes, backendURL } = useContext(PublicContext);

  const [openQuestionModal, setQuestionModal] = useState(false);


  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadData = () => {
      if (singleQuizDetail.title) {
        setQuizTitle(singleQuizDetail.title)
      }
      if (singleQuizDetail?.questions) {
        setQuestions(singleQuizDetail?.questions)
      }
    }
    loadData()
  }, [singleQuizDetail])


  const onPress = () => {
    navigate("/");
  };

  const renderQuestionComponent = (question, index) => {
    switch (question.type) {
      case "SingleSelect":
        return <SingleSelectQuestion question={question} setQuestions={setQuestions} index={index} backendURL={backendURL} />;
      case "MultiSelect":
        return <MultiSelectQuestion question={question} setQuestions={setQuestions} index={index} backendURL={backendURL} />;
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

  const updateQuiz = async () => {
    //CHeck Quiz Title
    if (quizTitle == "") {
      alert(`Please Enter the quiz title`);
      return;
    }

    //Checking atleast one option
    let indexOpt = -1;
    questions.find((question, index) => {
      if (question.type === "SingleSelect" || question.type === "MultiSelect" || question.type === "radioButton") {
        if (question?.options?.length <= 0) {
          indexOpt = index
          return;
        }
      }
    });
    if (indexOpt != -1) {
      alert(`Please add atleast one option for question ${indexOpt + 1}.`);
      return;
    }


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
      formData.append('quizID', singleQuizDetail._id);
      formData.append('quizTitle', quizTitle);


      questions.forEach((question, index) => {
        if (question?._id) {

          formData.append(`questions[${index}][_id]`, question._id);
        }
        formData.append(`questions[${index}][title]`, question.title);
        formData.append(`questions[${index}][type]`, question.type);


        question.options.forEach((option, optionIndex) => {
          formData.append(`questions[${index}][options][${optionIndex}][value]`, option.value);
          if (option.newImage) {
            if (question.type == "SingleSelect" || question.type == "MultiSelect") {
              formData.append('images', option.image);
              formData.append(`questions[${index}][options][${optionIndex}][newImage]`, true);
            }
          }
          else {
            formData.append(`questions[${index}][options][${optionIndex}][image]`, option.image);
          }
          // Append Products array
          option?.Products?.forEach((product, productIndex) => {
            formData.append(`questions[${index}][options][${optionIndex}][Products][${productIndex}]`, product);
          });
        });
      });

      const request = await fetch("/api/quiz/updateQuiz", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response.status) {
        const updatedQuizes = quizes?.map(quiz =>
          quiz._id === singleQuizDetail._id ? response.data : quiz
        );
        setQuizes(updatedQuizes);

        navigate("/");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <Header buttonText={"Go Back"} callBackFunction={onPress} />
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', borderRadius: '8px', margin: '50px 10%',
        backgroundColor: '#4c7480'

      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '30px 20%',
        }}>
          <div>
            <Text variant="bodyLg" as="h3">Quiz Title</Text>
            <TextField
              value={quizTitle}
              placeholder="Enter title here..."
              onChange={(newValue) => setQuizTitle(newValue)}
            />
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

          </div>


          <Button primary onClick={() => updateQuiz()}>
            SAVE
          </Button>
          <div style={{ marginTop: '10px' }}></div>
          <Button primary onClick={() => setQuestionModal(true)}>
            Add A Question
          </Button>
        </div>
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
}

export default EditQuiz;
