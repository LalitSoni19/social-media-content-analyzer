
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testServerConnection = async () => {
      try {
        const response = await fetch("/");
        if (!response.ok) throw new Error("Server responded with an error.");

        const data = await response.json();
        console.log("Server Response:", data.message);
      } catch (error) {
        console.error("Network error:", error.message);
      }
    };

    testServerConnection();
  }, [])

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    console.log("Selected file:", file);

    setUploadedFile(file);
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);
    console.log("FormData:", formData);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (!response.ok) throw new Error(data.error || "Server error occurred.");
        setAnalysisResult(data);
      } catch (jsonError) {
        throw new Error("Unexpected response format: " + responseText);
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      setError(error.message || "Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }

  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".pdf", ".png", ".jpg", ".jpeg"],
    // accept: {
    //   "application/pdf": [".pdf"],
    //   "image/*": [".png", ".jpg", ".jpeg"],
    // },
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Social Media Content Analyzer
      </Typography>

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed gray",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>
            Drag "n" drop files here, or click to select files
          </Typography>
        )}
      </div>

      {uploadedFile && (
        <Typography variant="body1" gutterBottom>
          Uploaded File: {uploadedFile.name}
        </Typography>
      )}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
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
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "400px",
              border: "1px solid gray",
              padding: 2,
            }}
          >
            <pre>
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;