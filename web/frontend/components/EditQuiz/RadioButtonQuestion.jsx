import React, { useState } from 'react';
import { TextField, Button, Text, RadioButton } from "@shopify/polaris";

const RadioButtonQuestion = ({ question, setQuestions, index }) => {
  const [value, setValue] = useState('disabled');
  const handleTitleChange = (newValue) => {
    // Update the title of the question
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], title: newValue };
      return updatedQuestions;
    });
  };

  const handleAddOption = () => {
    // Check if any option in the current question is empty
    const hasEmptyOption = question.options.some(option => option.value.trim() === '');

    if (hasEmptyOption) {
      // Alert the user or perform any other action to notify about the empty option
      alert("Please fill in all options before adding a new one.");
      return;
    }

    // Add an empty option to the options array of the current question
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const questionToUpdate = { ...updatedQuestions[index] };
      const newOptionObject = { id: Date.now(), value: '' }; // Empty option
      questionToUpdate.options.push(newOptionObject);
      updatedQuestions[index] = questionToUpdate;
      return updatedQuestions;
    });
  };

  const handleOptionChange = (optionId, newValue) => {
    // Update the value of the option
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const questionToUpdate = updatedQuestions[index];
      const updatedOptions = questionToUpdate.options.map(option =>
        option.id === optionId ? { ...option, value: newValue } : option
      );
      updatedQuestions[index] = { ...questionToUpdate, options: updatedOptions };
      return updatedQuestions;
    });
  };

  const handleRemoveOption = (optionId) => {
    // Remove the option from the options array
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const questionToUpdate = updatedQuestions[index];
      const updatedOptions = questionToUpdate.options.filter(option => option.id !== optionId);
      updatedQuestions[index] = { ...questionToUpdate, options: updatedOptions };
      return updatedQuestions;
    });
  };



  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <Text variant="bodyLg" as="h6">Title:</Text>
      <TextField
        value={question?.title}
        placeholder="Enter title..."
        onChange={handleTitleChange}
      />

      {question?.options?.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <Text variant="bodyLg" as="h6">Options:</Text>
        </div>
      )}
      <div>
        {question?.options.map((option, optionIndex) => (
          <div key={option.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px', marginBottom: '10px' }}>
            <div style={{ width: '90%',display:'flex',alignItems:'center' }}>
              <RadioButton
                checked={value}
                id="disabled"
                name="accounts"
                onChange={(newValue)=>  setValue(newValue) }

              />
              <div style={{width:"100%"}}>
              <TextField
                value={option.value}
                placeholder="Enter option..."
                onChange={(newValue) => handleOptionChange(option.id, newValue)}
              />
              </div>
            </div>
            <Button variant="secondary" onClick={() => handleRemoveOption(option.id)} style={{ verticalAlign: 'middle' }}>❌</Button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', minWidth: "100%", display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={handleAddOption}>Add Option</Button>
      </div>

    </div>
  );
};

export default RadioButtonQuestion;
