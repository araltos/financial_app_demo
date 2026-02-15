import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");

  // Helper: safe number parsing + formatting
  function parseAmount(v: any) {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function formatCurrency(value: number) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getCurrencySymbol(currencyCode: string) {
    switch (currencyCode) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return "$";
    }
  }

  // Helper: date display
  function formatDate(value: any) {
    if (!value) return "N/A";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return String(value);
    }
  }

  // Helper: Process backend data and update state
  const renderDashboard = (result: any) => {
    console.log("Backend response:", result);

    const totalMonthly = parseAmount(result.total_monthly_cost ?? result.totalBalance ?? 0);

    // Get the monthly goal from Settings
    const savedGoal = Number(localStorage.getItem("monthly_goal") || 1000);
    
    // Calculate budget progress (what % of budget is used)
    const budgetUsed = savedGoal > 0 ? Math.min(100, (totalMonthly / savedGoal) * 100) : 0;
    
    // Calculate remaining balance
    const remainingBalance = savedGoal - totalMonthly;

    setSummary({
      totalBalance: remainingBalance,
      monthlySpending: totalMonthly,
      savingsProgress: budgetUsed,
      monthlyGoal: savedGoal,
    });

    const rawSubs = Array.isArray(result.subscriptions) ? result.subscriptions : [];
    const normalized = rawSubs.map((s: any) => {
      return {
        date: s.next_billing_date ?? s.start_date ?? s.date ?? s.billing_date ?? null,
        description: s.name ?? s.plan_type ?? s.description ?? s.title ?? "Subscription",
        amount: parseAmount(s.amount ?? s.price ?? s.cost ?? 0),
        raw: s,
      };
    });

    setTransactions(normalized);
  };

  // Main data loading function with caching
  async function loadData() {
    // 1. Check Cache first
    const cached = localStorage.getItem("dash_cache");
    const cachedTime = localStorage.getItem("dash_cache_time");
    
    // If data is less than 1 minute old, use it immediately
    if (cached && cachedTime && (Date.now() - Number(cachedTime) < 60000)) {
      console.log("✅ Using cached data (less than 60 seconds old)");
      const result = JSON.parse(cached);
      renderDashboard(result);
      setLoading(false);
      return;
    }

    // 2. If no cache or expired, fetch from backend
    console.log("🔄 Fetching fresh data from backend...");
    setLoading(true);
    try {
      const result = await api.get("/api/subscriptions");
      localStorage.setItem("dash_cache", JSON.stringify(result));
      localStorage.setItem("dash_cache_time", Date.now().toString());
      renderDashboard(result);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setSummary({
        totalBalance: 0,
        monthlySpending: 0,
        savingsProgress: 0,
        monthlyGoal: 1000,
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load currency preference
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) setCurrency(savedCurrency);

    // Initial load
    loadData();

    // Listen for Upload to notify us that subscriptions changed
    const handler = () => {
      // Clear cache so we fetch fresh data
      localStorage.removeItem("dash_cache");
      localStorage.removeItem("dash_cache_time");
      loadData();
    };
    window.addEventListener("subscriptionsUpdated", handler);
    return () => {
      window.removeEventListener("subscriptionsUpdated", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 700 }}>Loading dashboard…</h1>
      </div>
    );
  }

  // Determine color based on budget usage
  const budgetColor = (summary?.savingsProgress ?? 0) > 80 ? "#ef4444" : "#28a745";

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "36px", color: "#1a1a1a", fontWeight: 700 }}>
          Welcome Back 👋
        </h1>
        <p style={{ color: "#555", marginTop: "8px", fontSize: "16px" }}>
          Here's a quick overview of your financial health today.
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
        {/* Remaining Balance */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>
            Remaining Balance
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: summary?.totalBalance >= 0 ? "#28a745" : "#ef4444" }}>
            {getCurrencySymbol(currency)}{formatCurrency(summary?.totalBalance ?? 0)}
          </h2>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
            of {getCurrencySymbol(currency)}{formatCurrency(summary?.monthlyGoal ?? 1000)} budget
          </p>
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
            {getCurrencySymbol(currency)}{formatCurrency(summary?.monthlySpending ?? 0)}
          </h2>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
            Total subscriptions cost
          </p>
        </div>

        {/* Budget Usage */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>
            Budget Used
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: budgetColor }}>
            {(summary?.savingsProgress ?? 0).toFixed(0)}%
          </h2>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
            {(summary?.savingsProgress ?? 0) > 80 ? "⚠️ Over budget!" : "✅ On track"}
          </p>
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
                <th style={{ padding: "14px 20px", color: "#555", textAlign: "left" }}>Date</th>
                <th style={{ padding: "14px 20px", color: "#555", textAlign: "left" }}>
                  Description
                </th>
                <th style={{ padding: "14px 20px", color: "#555", textAlign: "left" }}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "14px 20px", textAlign: "center" }}>No transactions</td>
                </tr>
              ) : (
                transactions.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #eee",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td style={{ padding: "14px 20px" }}>{formatDate(row.date)}</td>
                    <td style={{ padding: "14px 20px" }}>{row.description}</td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: row.amount < 0 ? "#d9534f" : "#28a745",
                      }}
                    >
                      {getCurrencySymbol(currency)}{formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}