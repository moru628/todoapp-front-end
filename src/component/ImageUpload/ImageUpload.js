import React, { useState } from 'react';
import './imageUpload.css'

const UploadImage = ({ setSelectedFile}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); 
    };

    return (
        <div className='upload-image'>
            <input
                type="file" 
                id="file-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor="file-input" style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                cursor: 'pointer', 
                borderRadius: '5px',
            }}>
                Choose Photo
            </label>
            {previewUrl && <img src={previewUrl} alt="Preview" className='changeProfileImg'/>}
        </div>
    );
};

export default UploadImage;
