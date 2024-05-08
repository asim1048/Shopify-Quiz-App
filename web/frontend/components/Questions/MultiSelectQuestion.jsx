import React, { useState } from 'react';
import { TextField, Button, Text } from "@shopify/polaris";

const SingleSelectQuestion = ({ question, setQuestions, index }) => {
  const [images, setImages] = useState(new Array(question.options.length).fill(null));
  const handleTitleChange = (newValue) => {
    // Update the title of the question
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], title: newValue };
      return updatedQuestions;
    });
  };

  const handleAddOption = () => {
    // Check if any option in the current question is empty or missing an image
    const hasEmptyOption = question.options.some(option => option.value.trim() === '' || !option.image);
  
    if (hasEmptyOption) {
      // Alert the user or perform any other action to notify about the empty option or missing image
      alert("Please fill in all options and select an image before adding a new one.");
      return;
    }
  
    // Add an empty option to the options array of the current question
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const questionToUpdate = { ...updatedQuestions[index] };
      const newOptionObject = { id: Date.now(), value: '', image: null }; // Empty option
      questionToUpdate.options.push(newOptionObject);
      updatedQuestions[index] = questionToUpdate;
      return updatedQuestions;
    });
    setImages(prevImages => [...prevImages, null]);
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
    setImages(prevImages => prevImages.filter((_, i) => i !== optionId));
  };

  const handleImageUpload = (event, optionIndex) => {
    const file = event.target.files[0];
    setImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages[optionIndex] = file;
      return updatedImages;
    });
    // Update the question with the new image
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const questionToUpdate = updatedQuestions[index];
      const updatedOptions = questionToUpdate.options.map((option, i) =>
        i === optionIndex ? { ...option, image: file } : option
      );
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
      {question?.options?.map((option, optionIndex) => (
        <div key={option.id} style={{ marginTop: '10px' }}>
          <Text variant="bodyLg" as="h6">Option {optionIndex + 1}:</Text>
          <TextField
            value={option.value}
            placeholder="Enter option..."
            onChange={(newValue) => handleOptionChange(option.id, newValue)}
          />
          <label htmlFor={`image-input-${index}-${optionIndex}`}>Upload Image:</label>
          <input
            type="file"
            id={`image-input-${index}-${optionIndex}`}
            accept="image/*"
            onChange={(event) => handleImageUpload(event, optionIndex)}
            style={{ display: 'none' }}
          />
          <Button onClick={() => document.getElementById(`image-input-${index}-${optionIndex}`).click()}>Choose File</Button>
          {images[optionIndex] && (
            <div style={{ marginTop: '5px' }}>
              <img src={URL.createObjectURL(images[optionIndex])} alt="Uploaded Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', borderRadius: "7px" }} />
            </div>
          )}
          <Button variant="secondary" onClick={() => handleRemoveOption(option.id)}>Remove Option</Button>
        </div>
      ))}
      <div style={{ marginTop: '10px', minWidth: "100%", display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={handleAddOption}>Add Option</Button>
      </div>
    </div>
  );
};

export default SingleSelectQuestion;
