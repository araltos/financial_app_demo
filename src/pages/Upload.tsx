import React, { useState, useRef } from "react";
import axios from "axios";
import { auth } from "../firebase"; // Ensure this points to your firebase.ts

export default function Upload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage({ text: "Please select a CSV file first.", type: 'error' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // 1. Get the fresh JWT token from Firebase
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      // 2. Prepare the Multipart Form Data (The "File" Jacob expects)
      const formData = new FormData();
      formData.append("file", file);

      // 3. Call Jacob's Transaction Service DIRECTLY (Bypassing Gateway as he instructed)
      const response = await axios.post(
        "https://transaction-service-258907763578.us-central1.run.app/api/transactions/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("Upload Success:", response.data);
      setMessage({ text: `✅ Success! ${response.data.parsed_count} rows processed.`, type: 'success' });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);

    } catch (err: any) {
      console.error("Upload Error:", err);
      const errorMsg = err.response?.data?.detail || "Upload failed. Check console.";
      setMessage({ text: `❌ Error: ${errorMsg}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>Upload Transactions</h1>
      
      <div style={{ border: "2px dashed #ccc", padding: "40px", borderRadius: "12px", textAlign: "center", background: "white" }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          id="fileInput"
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer", color: "#2563eb", fontWeight: 600 }}>
          {fileName ? `Selected: ${fileName}` : "Click to browse CSV file"}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !fileName}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px",
          backgroundColor: uploading ? "#ccc" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: uploading ? "not-allowed" : "pointer"
        }}
      >
        {uploading ? "Processing File..." : "Upload to Transaction Service"}
      </button>

      {message && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          borderRadius: "8px", 
          backgroundColor: message.type === 'success' ? "#dcfce7" : "#fee2e2",
          color: message.type === 'success' ? "#166534" : "#991b1b"
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}