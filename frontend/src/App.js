import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, CircularProgress, Typography, Box, Alert } from '@mui/material';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);


  const onDrop = async (acceptedFiles) => {

    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setLoading(true);
      setError(null); // Clear previous errors
      setAnalysisResult(null); // Clear previous results

      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setAnalysisResult(data);
        } else {
          // Handle errors from the backend
          const errorData = await response.json();
          setError(errorData.error || 'An error occurred during analysis.');
        }
      } catch (error) {
        setError('Network error: Could not connect to the server.');

      } finally {
        setLoading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Social Media Content Analyzer
      </Typography>

      <div {...getRootProps()} style={{
        border: '2px dashed gray',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>Drag 'n' drop files here, or click to select files</Typography>
        )}
      </div>

      {uploadedFile && (
        <Typography variant="body1" gutterBottom>
          Uploaded File: {uploadedFile.name}
        </Typography>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

      {analysisResult && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Analysis Result:</Typography>
          <Box sx={{ overflow: 'auto', maxHeight: '400px', border: '1px solid gray', padding: 2 }}>
            <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
          </Box>
        </Box>
      )}


    </Box>
  );
}

export default App;