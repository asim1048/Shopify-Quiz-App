import React, { useState } from 'react';
import { TextField, Button, Text } from "@shopify/polaris";

const MultiSelectQuestion = ({ question, setQuestions, index }) => {
  const [image, setImage] = useState(null);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    // Update the question with the new image
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], image: file };
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
       <div style={{ marginTop: '10px', gap:"20px" }}>
        <label htmlFor={`image-input-${index}`}>Upload Image:</label>
        <input
          type="file"
          id={`image-input-${index}`}
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none'  }}
        />
        <Button onClick={() => document.getElementById(`image-input-${index}`).click()}>Choose File</Button>
        {image && (
        <div style={{ marginTop: '5px' }}>
          <img src={URL.createObjectURL(image)} alt="Uploaded Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', borderRadius:"7px" }} />
        </div>
      )}      </div>
      {question?.options?.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <Text variant="bodyLg" as="h6">Options:</Text>
        </div>
      )}
      <div>
        {question?.options.map((option, optionIndex) => (
          <div key={option.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px', marginBottom: '10px' }}>
            <div style={{ width: '90%' }}>
              <TextField
                value={option.value}
                placeholder="Enter option..."
                onChange={(newValue) => handleOptionChange(option.id, newValue)}
              />
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

export default MultiSelectQuestion;
