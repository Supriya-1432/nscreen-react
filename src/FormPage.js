import React, { useState } from 'react';
import formData from './FormData.json';
import './App.css';

const FormPage = () => {
  const questions = formData.formData.questions;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [errors, setErrors] = useState([]);
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (questionId, value) => {
    setFormValues((prevData) => ({
      ...prevData,
      [questionId]: value,
    }));
  };

  const handleNextScreen = () => {
    const currentQuestion = questions[currentScreen];

    if (
      currentQuestion.isFirstRadioQuestion &&
      formValues[currentQuestion.id] === currentQuestion.choices[0].choice_text
    ) {
      setCurrentScreen(questions.length);
      setErrors([]);
    } else {
      if (currentQuestion.required && !formValues[currentQuestion.id]) {
        setErrors([...errors, currentQuestion.id]);
        return;
      }

      setTimeout(()=>{setCurrentScreen(currentScreen + 1)},1000);
      setErrors([]);
    }
  };

  const handlePreviousScreen = () => {
    setTimeout(()=>{setCurrentScreen(currentScreen - 1)},1000);
    setErrors([]);
  };

  const handleSubmit = () => {
    // Perform submission logic with the formValues
    console.log(formValues);
  };

  return (
    <div>
      {currentScreen < questions.length ? (
        <div>
          <h1>{currentScreen+1}.{questions[currentScreen].question_text}</h1>
          {errors.includes(questions[currentScreen].id) && (
            <h3 style={{ color: 'red' }}>Please provide an answer for this question.</h3>
          )}
          {questions[currentScreen].question_type === 1 && (
            <div>
              {questions[currentScreen].choices.map((choice) => (
                <div key={choice.id}>
                  <label>
                    <input
                      type="radio"
                      name={questions[currentScreen].id}
                      value={choice.choice_text}
                      checked={formValues[questions[currentScreen].id] === choice.choice_text}
                      onChange={(e) => handleInputChange(questions[currentScreen].id, e.target.value)}
                    />
                    {choice.choice_text}
                  </label>
                </div>


              ))}
            </div>
          )}
          {questions[currentScreen].question_type === 2 && (
            <div>
              <select
                name={questions[currentScreen].id}
                value={formValues[questions[currentScreen].id] || ''}
                onChange={(e) => handleInputChange(questions[currentScreen].id, e.target.value)}
              >
                <option value="">Select an option</option>
                {questions[currentScreen].choices.map((choice) => (
                  <option key={choice.id} value={choice.choice_text}>
                    {choice.choice_text}
                  </option>
                ))}
              </select>
            </div>
          )}
          {questions[currentScreen].question_type === 3 && (
            <div>
              {questions[currentScreen].choices.map((choice) => (
                <div key={choice.id}>
                  <label>
                    <input
                      type="checkbox"
                      name={questions[currentScreen].id}
                      value={choice.choice_text}
                      checked={formValues[questions[currentScreen].id]?.includes(choice.choice_text)}
                      onChange={(e) => {
                        const selectedOptions = formValues[questions[currentScreen].id] || [];
                        if (e.target.checked) {
                          selectedOptions.push(choice.choice_text);
                        } else {
                          const index = selectedOptions.indexOf(choice.choice_text);
                          if (index !== -1) {
                            selectedOptions.splice(index, 1);
                          }
                        }
                        handleInputChange(questions[currentScreen].id, selectedOptions);
                      }}
                    />
                    {choice.choice_text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {questions[currentScreen].question_type === 4 && (
          <div class="input-container">
            <input type="text"
              name={questions[currentScreen].id}
              value={formValues[questions[currentScreen].id] || ''}
              onChange={(e) => handleInputChange(questions[currentScreen].id, e.target.value)}/>
            <label for="input" class="label">Enter Text</label>
            <div class="underline"></div>
          </div>
          )}
          {questions[currentScreen].question_type === 5 && (
            <div>
              <input
                type="file"
                name={questions[currentScreen].id}
                onChange={(e) => handleInputChange(questions[currentScreen].id, e.target.files[0])}
              />
            </div>
          )}
          <br/><br/>
          <button onClick={handlePreviousScreen}>Previous</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <button  onClick={handleNextScreen}>Next</button>

        </div>
      ) : (
        <div>
          <h1>Submission Screen</h1>
          {Object.entries(formValues).map(([questionId, answer]) => {
          const question = questions.find((q) => q.id === parseInt(questionId));
          if (question.question_type === 3) {
            // Checkbox question
            const selectedOptions = formValues[questionId];
            if (selectedOptions && selectedOptions.length > 0) {
              return (
                <div key={questionId}>
                  <strong>Question:</strong> {question.question_text}<br />
                  <strong>Answer:</strong>
                  <ul>
                    {selectedOptions.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          }else {
            // Other question types
            return (
              <p key={questionId}>
                <strong>Question:</strong> {question.question_text}<br />
                <strong>Answer:</strong> {typeof answer === 'object' ? answer.name : answer}
              </p>
            );
          }
        })}

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default FormPage;
