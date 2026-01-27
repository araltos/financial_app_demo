export default function Dashboard() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "36px", color: "#1a1a1a", fontWeight: 700 }}>
          Welcome Back 👋
        </h1>
        <p style={{ color: "#555", marginTop: "8px", fontSize: "16px" }}>
          Here’s a quick overview of your financial health today.
        </p>
      </header>

      {/* Metrics Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>
            Total Balance
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a" }}>
            $12,450.00
          </h2>
        </div>

        {/* Monthly Spending */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>
            Monthly Spending
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#d9534f" }}>
            -$3,200.00
          </h2>
        </div>

        {/* Savings Goal */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>
            Savings Goal Progress
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#28a745" }}>
            85%
          </h2>
        </div>
      </div>

      {/* Recent Transactions */}
      <section>
        <h2
          style={{
            fontSize: "24px",
            color: "#1a1a1a",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Recent Transactions
        </h2>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
            }}
          >
            <thead style={{ background: "#f0f2f5" }}>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 20px",
                    color: "#555",
                    fontWeight: 600,
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 20px",
                    color: "#555",
                    fontWeight: 600,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 20px",
                    color: "#555",
                    fontWeight: 600,
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                { date: "Jan 26, 2026", description: "Apple Store", amount: "-$1,200.00" },
                { date: "Jan 25, 2026", description: "Starbucks", amount: "-$5.50" },
              ].map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  <td style={{ padding: "14px 20px" }}>{row.date}</td>
                  <td style={{ padding: "14px 20px" }}>{row.description}</td>
                  <td style={{ padding: "14px 20px", color: "#d9534f" }}>
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}