import axios from 'axios';
import { ChangeEvent, useState } from 'react';

const ImageUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) setFile(files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file ');
            return;
        }

        try {
            const filename = encodeURIComponent(file.name);
            const contentType = file.type;

            // Send POST request to API Gateway
            const response = await axios.post(
                'your-api-url',
                { filename, contentType }
            );

            const { uploadURL } = response.data;
            console.log(uploadURL, response.data);

            // Upload the file to S3 using the pre-signed URL
            await axios.put(uploadURL, file, {
                headers: { 'Content-Type': file.type },
            });

            setMessage('Upload successful!');


        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Upload failed. Please try again.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default ImageUpload;