import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaFolderPlus } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";

import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('#ffffff');
    const [folders, setFolders] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#FF8C33'];

    const navigate = useNavigate(); 

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = (event) => {
        event.preventDefault(); 
        navigate('/'); 
    };

    const toggleModal = (e) => {
        e.preventDefault();
        setShowModal(!showModal);
    };

    const toggleAboutModal = (e) => {
        e.preventDefault();
        setShowAboutModal(!showAboutModal);
    };

    const toggleLogoutModal = (e) => {
        e.preventDefault();
        setShowLogoutModal(!showLogoutModal);
    };

    const toggleContactModal = (e) => {
        e.preventDefault();
        setShowContactModal(!showContactModal);
    };

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    const handleFolderColorChange = (color) => {
        setSelectedColor(color);
        setFolderColor(color);
    };

    const handleAddFolder = async () => {
        if (folderName.trim()) {
            const newFolder = { name: folderName, color: folderColor };
            
            try {
                const response = await fetch('http://localhost:8081/add-folder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFolder),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log("Folder added:", data);
                    
                    setFolders([...folders, { ...newFolder, id: data.folderId }]); 
                } else {
                    console.error("Failed to add folder:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding folder:", error);
            }
    
            setShowModal(false);
            setFolderName('');
            setFolderColor('#ffffff');
            setSelectedColor('');
        }
    };
    

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddFolder();
        }
    };

    const openFolderModal = (folder) => {
        setSelectedFolder(folder); 
    };

    const closeFolderModal = () => {
        setSelectedFolder(null); 
    };

    return (
        <div>
            <GiHamburgerMenu className="hamburger-icon" onClick={toggleSidebar} />
            <div className={`sidenav ${isOpen ? 'active' : ''}`}>
                <ul>
                    <li>
                        <Link to="/page" className="link">
                            <div className="icon"><IoHome /></div>
                            <div className="text">Home</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={toggleModal} className="link">
                            <div className="icon"><FaFolderPlus /></div>
                            <div className="text">New Folder</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/editfolder" className="link">
                            <div className="icon"><FaEdit /></div>
                            <div className="text">Edit Folder</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={toggleAboutModal} className="link">
                            <div className="icon"><FaInfoCircle /></div>
                            <div className="text">About</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={toggleContactModal} className="link">
                            <div className="icon"><MdEmail /></div>
                            <div className="text">Contact</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={toggleLogoutModal} className="link">
                            <div className="icon"><FiLogOut /></div>
                            <div className="text">Log-out</div>
                        </Link>
                    </li>
                </ul>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Folder</h2>
                        <input 
                            type="text" 
                            placeholder="Folder name" 
                            value={folderName} 
                            onChange={handleFolderNameChange} 
                        />
                        <h2>Color:</h2>
                        <div className="color-options">
                            {colors.map((color) => (
                                <button 
                                    key={color} 
                                    style={{ backgroundColor: color }} 
                                    onClick={() => handleFolderColorChange(color)} 
                                    className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                                />
                            ))}
                        </div>
                        <div className="button-container">
                            <button type="button" onClick={toggleModal}>
                                Close
                                <IoCloseCircle className='newicons' />
                            </button>
                            <button type="button" onClick={handleAddFolder}>
                                Add
                                <IoMdAddCircle className='newicons' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAboutModal && (
                <div className="modal-overlay" onClick={toggleAboutModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>About This Application</h2>
                        <p>FlashLearn is an application that allows you to quickly learn using flashcards.</p>
                        <div className="closebutton">
                            <button type="button" onClick={toggleAboutModal}>
                                Close
                                <IoCloseCircle className='newicons' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showContactModal && (
                <div className="modal-overlay" onClick={toggleContactModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Contact</h2>
                        <p>aaaa@gmail.com</p>
                        <div className="closebutton">
                            <button type="button" onClick={toggleContactModal}>
                                Close
                                <IoCloseCircle className='newicons' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutModal && (
                <div className="modal-overlay" onClick={toggleLogoutModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Log-out</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className="button-container">
                            <button type="button" onClick={toggleLogoutModal}>
                                No
                            </button>
                            <form onSubmit={handleLogout}>
                                <button type="submit">
                                    Yes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div>
                {folders.length > 0 && (
                    <div className="folder-tab">
                        {folders.map((folder, index) => (
                            <div key={index} className="new-folder" onClick={() => openFolderModal(folder)}>
                                <div className="small-rectangle" style={{ backgroundColor: folder.color }}></div>
                                <h2>{folder.name}</h2>
                            </div>
                        ))}
                    </div>
                )}
                {selectedFolder && (
                    <div className="modal-overlay" onClick={closeFolderModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{selectedFolder.name}</h2>
                            <p>Color: {selectedFolder.color}</p>
                            <div className="button-container">
                                <button type="button" onClick={closeFolderModal}>
                                    Close <IoCloseCircle className='newicons' />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
