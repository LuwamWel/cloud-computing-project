
import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../context/auth.context"
import api from "../custom-axios"


export default function Profile() {
    const { user, setUser } = useAuth()
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${user?.email}`);
                setUser(response.data);
                sessionStorage.setItem('user', JSON.stringify(response.data))
            } catch (error) {
                console.error('Error fetching user:', error);
                setMessage('Failed to fetch user data.');
            }
        };
        

        fetchUser();
    }, []); // Only runs on mount


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) setFile(files[0]);
    };

    const handleUpload = async (email: string) => {
        if (!file) {
            setMessage('Please select a file ');
            return;
        }

        try {
            const filename = encodeURIComponent(file.name);
            const contentType = file.type;

            // Send POST request to API Gateway
            const response = await api.put(
                '/users',
                { filename, contentType, email }
            );

            const { uploadURL } = response.data;
            console.log(uploadURL, response.data);
            // Upload the file to S3 using the pre-signed URL
            await api.put(uploadURL, file, {
                headers: { 'Content-Type': file.type },
            });

            setMessage('Upload successful!');


        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Upload failed. Please try again.');
        }
    };

    return (
        user && <>
            <p>Name : {user.name}</p>
            <p>Email : {user.email}</p>
            {user.profileImage ?
                <p><img src={user.profileImage} style={{ width: 200, height: 200, borderRadius: "50%" }} alt="Profile Image" /></p>
                :
                <div>
                    <h2> Profil Image Upload</h2>
                    <p><input type="file" onChange={handleFileChange} /></p>
                    <button onClick={() => handleUpload(user.email)}>Upload</button>
                </div>
            }
            {/* Display message if it exists */}
            {message && <p>{message}</p>}
        </>
    )
}