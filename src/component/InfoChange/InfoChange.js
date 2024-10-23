import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import './infoChange.css';
import UploadImage from '../ImageUpload/ImageUpload';

const InfoChange = ({ open, onClose, user, setUser, description, setDescription,setProfileImg,userId,setUserName }) => {
  const [newDescription, setNewDescription] = useState(description);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (open && user) {
      setNewDescription(description);
      setNewName(user.name || '');
    }
  }, [open, user, description]);

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const updateData = {
        description: newDescription,
        name: newName
      }

      const response = await axios.put(`http://localhost:5050/user/${userId}`, updateData);
      
      setDescription(response.data.description);
      setUser(response.data);
      setUserName(response.data.name);

      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImg', selectedFile);
        formData.append('description', newDescription); 

        const uploadResponse = await axios.post(`http://localhost:5050/upload-image/${userId}`, formData);

       const newProfileImg = `http://localhost:5050/upload/${uploadResponse.data.user.profileImg}`;
       setProfileImg(newProfileImg);
       localStorage.setItem('profileImg', newProfileImg);
      }
    } catch (error) {
        console.error("Error uploading image:", error);
    }finally {
      onClose();
    }
};

  const handleDialogClose = () => {
    onClose();
    setNewDescription(''); 
    setSelectedFile(null);
    setNewName('')
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>
        Edit Profile
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <UploadImage setSelectedFile={setSelectedFile} />
        <Button color="primary" 
          sx={{
            fontSize: "15px",
            color: "#367302",
          }}
        onClick={handleUpload}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InfoChange;
