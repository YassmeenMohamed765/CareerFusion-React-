// ApplicationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationPage = () => {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const navigate = useNavigate();

  const handleCoverLetterChange = (event) => {
    setCoverLetter(event.target.value);
  };

  const handleCvFileChange = (event) => {
    setCvFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the data to your server
    // For example, you might use FormData and fetch() to submit it.
    console.log(coverLetter);
    console.log(cvFile);

    // Clear the form (optional)
    setCoverLetter('');
    setCvFile(null);
    navigate('/userHome');


    // Navigate to a thank you page or display a message (optional)
    // navigate('/thank-you');
  };

  return (
    <div className="container">
        <img src={process.env.PUBLIC_URL + '/images/application-page.png'} alt="Application Page" /> 
            <div className="form-container">
            <h1>Submit Application</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="coverLetter">Type Your Cover Letter</label>
                <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={handleCoverLetterChange}
                placeholder="cover letter..."
                />

                <label htmlFor="cvUpload">Upload Your CV</label>
                <input
                type="file"
                id="cvUpload"
                onChange={handleCvFileChange}
                />

                <button type="submit">Submit</button>
            </form>
            </div>

    </div>
  );
};

export default ApplicationPage;
