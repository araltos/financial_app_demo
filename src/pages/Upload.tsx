import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleUpload = () => {
    if (file) {
      alert(`✅ Demo: Sending "${file.name}" to the Transaction Service...\n\nIn production, this would:\n1. Parse the CSV\n2. Validate transactions\n3. Sync with your bank\n4. Update your dashboard`);
      setFile(null);
    } else {
      alert('⚠️ Please select a file first');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", color: "#1a1a1a", fontWeight: 700 }}>
          Upload Financial Data
        </h1>
        <p style={{ color: "#666", marginTop: "8px", fontSize: "16px", maxWidth: "600px" }}>
          Import your bank statements (CSV format) to sync transactions and get real-time insights.
        </p>
      </header>

      {/* Upload Card */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          padding: "40px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: isDragActive ? "2px solid #3b82f6" : "2px dashed #d1d5db",
            borderRadius: "8px",
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#eff6ff" : "#f9fafb",
            transition: "all 0.2s ease",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "48px" }}>📄</span>
          </div>
          <p style={{ color: "#1a1a1a", fontSize: "16px", fontWeight: 600, margin: "0 0 8px 0" }}>
            {isDragActive ? "Drop your CSV file here" : "Drag and drop your CSV file"}
          </p>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 16px 0" }}>
            or click below to browse
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
            id="file-input"
          />
          <label
            htmlFor="file-input"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "14px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Choose File
          </label>
        </div>

        {/* File Info */}
        {file && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#166534", margin: "0 0 4px 0", fontWeight: 600 }}>
              ✅ File Selected
            </p>
            <p style={{ color: "#4b7c0f", margin: 0, fontSize: "14px" }}>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "12px 24px",
            background: file ? "#3b82f6" : "#d1d5db",
            color: file ? "white" : "#6b7280",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: file ? "pointer" : "not-allowed",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (file) (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            if (file) (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
          }}
          disabled={!file}
        >
          {file ? "Upload to Transaction Service" : "Select a file to upload"}
        </button>

        {/* Info Section */}
        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <h3 style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: 600, margin: "0 0 12px 0" }}>
            📋 CSV Format Requirements
          </h3>
          <ul style={{ color: "#666", fontSize: "14px", margin: 0, paddingLeft: "20px" }}>
            <li>Columns: Date, Description, Amount</li>
            <li>Date format: MM/DD/YYYY</li>
            <li>Amount format: Positive numbers (e.g., 1200.50)</li>
            <li>Max file size: 10 MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}