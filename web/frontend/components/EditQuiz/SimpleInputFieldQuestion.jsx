import React from 'react';
import { TextField, Text } from "@shopify/polaris";

const SimpleInputFieldQuestion = ({ question, setQuestions, index }) => {

  const handleTitleChange = (newValue) => {
    // Update the title of the question
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], title: newValue };
      return updatedQuestions;
    });
  };


  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <Text variant="bodyLg" as="h6">Title:</Text>
      <TextField
        value={question?.title}
        placeholder="Enter a question title (e.g., Name, Email...)"
        onChange={handleTitleChange}
      />
       
      
    </div>
  );
};

export default SimpleInputFieldQuestion;
