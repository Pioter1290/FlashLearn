import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [showContactModal, setShowContactModal] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('#ffffff'); 
    const [folders, setFolders] = useState([]);
    const [selectedColor, setSelectedColor] = useState(''); 

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#FF8C33']; 

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = (e) => {
        e.preventDefault(); 
        setShowModal(!showModal);
    };

    const toggleAboutModal = (e) => {
        e.preventDefault();
        setShowAboutModal(!showAboutModal);
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

    const handleAddFolder = () => {
        if (folderName.trim()) {
            setFolders([...folders, { name: folderName, color: folderColor }]); 
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
                        <Link to="/" className="link">
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
                            <button onClick={toggleModal}>
                                Close
                                <IoCloseCircle className='newicons'/>
                            </button>
                            <button onClick={handleAddFolder}>
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
                            <button onClick={toggleAboutModal}>
                                Close
                                <IoCloseCircle className='newicons'/>
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
                            <button onClick={toggleContactModal}>
                                Close
                                <IoCloseCircle className='newicons'/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {folders.length > 0 && (
    <div className="new-folder">
        {folders.map((folder, index) => (
            <div
                key={index}
                className="folder"
                style={{ backgroundColor: folder.color }}
            >
                <h1>{folder.name}</h1>
            </div>
        ))}
    </div>
)}
        </div>
    );
};

export default Navbar;
