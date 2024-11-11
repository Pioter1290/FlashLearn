import React, { useState, useEffect } from 'react';
import './FlashCards.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";

const FlashCards = () => {
  const [showModal, setShowModal] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '', folder_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const folderId = localStorage.getItem('folder-id');
    if (folderId) {
      setNewFlashcard((prevFlashcard) => ({
        ...prevFlashcard,
        folder_id: Number(folderId),
      }));

      axios.get(`http://localhost:8081/flashcards?folder_id=${folderId}`)
        .then(response => {
          console.log("Flashcards:", response.data);
          setFlashcards(response.data); 
        })
        .catch(error => {
          console.error("Error fetching flashcards:", error);
        });
    }
  }, []);

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    setShowModal(false); // Hide the modal
    navigate("/page");
  };

  const handleAddFlashcard = () => {
    setIsAdding(true);
  };
  
  const handleDeleteFlashcard = () => {
    setIsDeleting(true);
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

  return (
    <>
      <div className="top">
        <h1>FlashLearn</h1>
      </div>

      {showModal && (
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
                      {flashcards.map(flashcard => (
                        <tr key={flashcard.id}>
                          <td>{flashcard.question}</td>
                          <td>{flashcard.answer}</td>
                          <td><button className='select-button' onClick={() => selectFlashcardToDelete(flashcard)}>Select</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                </div>
                {flashcardToDelete && (
                  <div>
                    <p>Are you sure you want to delete the flashcard: {flashcardToDelete.question}?</p>
                    <button onClick={handleDeleteConfirmed}>Delete</button>
                    
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
                  <button className="modal-button">Edit Flashcard </button>
                  
                  <button className="learn-button">Learn</button>
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
