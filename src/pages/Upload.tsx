import React, { useState } from "react";
import Papa from "papaparse";
import { api } from "../api"; 

export default function Upload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setMessage(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // This maps your Google Sheet columns to the backend
        const normalized = results.data.map((row: any) => ({
          name: row.name || "",
          amount: parseFloat(row.amount) || 0,
          billing_cycle: row.billing_cycle || "monthly",
          next_billing_date: row.next_billing_date || ""
        }));
        setParsedData(normalized);
        console.log("Parsed Data:", normalized);
      }
    });
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      setMessage({ text: "Please select a valid CSV file first.", type: 'error' });
      return;
    }

    setUploading(true);
    try {
      // THE FIX: Jacob wants an OBJECT with a 'subscriptions' key
      const payload = {
        subscriptions: parsedData 
      };

      console.log("Sending Payload:", payload);

      const response = await api.post("/api/subscriptions", payload);

      console.log("Server Response:", response);
      setMessage({ text: "✅ Successfully uploaded to the Transaction Service!", type: 'success' });
      
      setFileName(null);
      setParsedData([]);

      // This will refresh the page so the Dashboard shows the new data
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);

    } catch (err: any) {
      console.error("Upload Error:", err);
      const body = err?.body;
      let msg = "Upload failed";
      if (body && body.detail) {
        msg = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
      }
      setMessage({ text: `❌ Error: ${msg}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>Upload Transactions</h1>
      
      <div style={{ border: "2px dashed #ccc", padding: "40px", borderRadius: "12px", textAlign: "center", background: "white" }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
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
        {uploading ? "Uploading..." : "Upload to Transaction Service"}
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