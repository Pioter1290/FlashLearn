import React, { useState, useEffect } from 'react';
import './FlashCards.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlashCards = () => {

  const [showModal, setShowModal] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '', folder_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); 
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderId = localStorage.getItem('folder-id');
        if (folderId) {
          setNewFlashcard(prevFlashcard => ({
            ...prevFlashcard,
            folder_id: Number(folderId),
          }));

          const response = await axios.get(`http://localhost:8081/flashcards?folder_id=${folderId}`);
          console.log("Flashcards:", response.data);

          const formattedFlashcards = response.data.map(flashcard => ({
            id: flashcard.flashcard_id,
            question: flashcard.flashcard_question,
            answer: flashcard.flashcard_answer,
          }));

          setFlashcards(formattedFlashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchData();
  }, []);

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    setShowModal(false);
    navigate("/page");
  };

  const handleAddFlashcard = () => {
    setIsAdding(true);
  };

  const handleDeleteFlashcard = () => {
    setIsDeleting(true);
  };

  const handleLearnFlashcard = () => {
    setIsLearning(true);
    setCurrentCardIndex(0); 
  };

  const handleSaveFlashcard = async () => {
    try {
      const response = await fetch('http://localhost:8081/add-flashcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlashcard),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      setFlashcards([...flashcards, { ...newFlashcard, id: data.flashcardId }]);
      setNewFlashcard({ question: '', answer: '', folder_id: Number(localStorage.getItem('folder-id')) });
      setIsAdding(false);
      
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFlashcard({ ...newFlashcard, [name]: value });
  };

  const handleCloseAddModal = () => {
    setIsAdding(false);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false); 
    setFlashcardToDelete(null);
  };

  const handleCloseLearnModal = () => {
    setIsLearning(false);
    setCurrentCardIndex(0); 
    setShowAnswer(false);
    setIsFlipped(false); 
  };

  const handleDeleteConfirmed = async () => {
    if (flashcardToDelete) {
      try {
        const response = await fetch(`http://localhost:8081/delete-flashcard/${flashcardToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setFlashcards(flashcards.filter(flashcard => flashcard.id !== flashcardToDelete.id));
        setFlashcardToDelete(null);
        setIsDeleting(false);
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };

  const selectFlashcardToDelete = (flashcard) => {
    setFlashcardToDelete(flashcard);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
      setIsFlipped(false); 
    } else {
      alert("You've completed all flashcards!");
    }
  };
  
  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
      setIsFlipped(false); 
    } else {
      alert("It's the first flashcard!");
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsFlipped(!isFlipped); 
  };

  return (
    <>
      <div className="top">
        <h1>FlashLearn</h1>
      </div>

      {showModal && !isLearning && (
        <div className="tab">
          <div className="modal">
            {isDeleting ? (
              <div>
                <h2 className='colors'>Delete Flashcard</h2>
                <p className='colors'>Choose flashcard which you want to delete:</p>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flashcards.length > 0 ? (
                        flashcards.map(flashcard => (
                          <tr key={flashcard.id}>
                            <td>{flashcard.question}</td>
                            <td>{flashcard.answer}</td>
                            <td><button className='select-button' onClick={() => selectFlashcardToDelete(flashcard)}>Select</button></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">No flashcards available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {flashcardToDelete && (
                  <div>
                    <p>Are you sure you want to delete the flashcard: {flashcardToDelete.question}?</p>
                    <button className="learn-button" onClick={handleDeleteConfirmed}>Delete</button>
                  </div>
                )}
                <button className="cancel-button" onClick={handleCancelDelete}>Cancel</button>
              </div>
            ) : (
              !isAdding && (
                <div className="modal-buttons">
                  <h2>Manage Flashcards</h2>
                  <button className="modal-button" onClick={handleAddFlashcard}>Add Flashcard</button>
                  <button className="modal-button" onClick={handleDeleteFlashcard}>Delete Flashcard</button>
                  <button className="modal-button">Edit Flashcard</button>
                  <button className="learn-button" onClick={handleLearnFlashcard}>Learn</button>
                  <button className="close-btn" onClick={handleExit}>Exit</button>
                </div>
              )
            )}
            {isAdding && (
              <div className="add-flashcard-form">
                <h2>Add Flashcard</h2>
                <textarea
                  name="question"
                  placeholder="Question"
                  value={newFlashcard.question}
                  onChange={handleChange}
                  rows="4"
                />
                <textarea
                  name="answer"
                  placeholder="Answer"
                  value={newFlashcard.answer}
                  onChange={handleChange}
                  rows="4"
                />
                <button className="learn-button" onClick={handleSaveFlashcard}>Save</button>
                <button className="cancel-button" onClick={handleCloseAddModal}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isLearning && flashcards.length > 0 && (
        <div className="learn-modal">
          <div className="modal">
            <div className="learn-form">
                <h2>Learn Flashcards</h2>
                <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}>
                  <div className="flashcard">
                    <div className="front">
                      <p>{flashcards[currentCardIndex].question}</p>
                    </div>
                    <div className="back">
                      <p> {flashcards[currentCardIndex].answer}</p>
                    </div>
                  </div>
                </div>
                <div className="button-container">
                  <button className="prevAndNext-btns" onClick={handlePreviousCard}>Previous</button>
                  <button className="prevAndNext-btns" onClick={handleNextCard}>Next</button>
                </div>
                <button className="learn-button" onClick={handleShowAnswer}>
                  {isFlipped ? 'Show Question' : 'Show Answer'}
                </button>
                <button className="cancel-button" onClick={handleCloseLearnModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showExitModal && (
        <div className="modal-overlay" onClick={handleCancelExit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Exit</h2>
            <p>Are you sure you want to exit?</p>
            <div className="button-container">
              <button type="button" onClick={handleCancelExit}>
                No
              </button>
              <button type="button" onClick={handleConfirmExit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashCards;
