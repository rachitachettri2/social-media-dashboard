const baseUrl = "/api";
const accountsTableBody = document.querySelector("#accountsTable tbody");
const messageEl = document.querySelector("#message");
const addAccountForm = document.querySelector("#addAccountForm");
const refreshBtn = document.querySelector("#refreshBtn");

const socket = io();

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#dc2626" : "#16a34a";
  if (text) setTimeout(() => (messageEl.textContent = ""), 3500);
}

function renderTable(accounts) {
  accountsTableBody.innerHTML = "";

  if (!accounts.length) {
    accountsTableBody.innerHTML =
      "<tr><td colspan=7>No accounts yet.</td></tr>";
    return;
  }

  for (const account of accounts) {
    const lastMetric = account.metrics?.[account.metrics.length - 1] || {};
    const dateString = account.lastUpdated
      ? new Date(account.lastUpdated).toLocaleString()
      : "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${account.platform}</td>
      <td>${account.username}</td>
      <td>${Number(lastMetric.followers || 0).toFixed(0)}</td>
      <td>${Number(lastMetric.likes || 0).toFixed(0)}</td>
      <td>${Number(lastMetric.posts || 0).toFixed(0)}</td>
      <td>${dateString}</td>
      <td>
        <button class="success" data-action="update" data-id="${account._id}">Update</button>
        <button class="danger" data-action="delete" data-id="${account._id}">Delete</button>
        <button class="secondary" data-action="export" data-id="${account._id}">Export</button>
      </td>
    `;

    accountsTableBody.appendChild(row);
  }
}

async function fetchDashboard() {
  try {
    const res = await fetch(`${baseUrl}/accounts/dashboard`);
    if (!res.ok) throw new Error(`Could not load dashboard (${res.status})`);

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Unknown API error");

    renderTable(data.data || []);
    showMessage(`Loaded ${data.count} accounts`);
  } catch (error) {
    showMessage(error.message || "Failed to load dashboard", true);
  }
}

async function createAccount(platform, username) {
  try {
    const res = await fetch(`${baseUrl}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, username }),
    });

    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.error || "Create failed");

    showMessage(`Created ${result.data.username}`);
    fetchDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function updateMetrics(id) {
  try {
    const res = await fetch(`${baseUrl}/metrics/${id}`, { method: "POST" });
    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.error || "Update failed");
    showMessage(`Metrics updated for ${result.data.username}`);
    fetchDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteAccount(id) {
  try {
    const res = await fetch(`${baseUrl}/accounts/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.error || "Delete failed");
    showMessage("Account deleted");
    fetchDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function exportMetrics(id) {
  window.location = `${baseUrl}/metrics/export/${id}`;
}

accountsTableBody.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "update") updateMetrics(id);
  if (action === "delete") deleteAccount(id);
  if (action === "export") exportMetrics(id);
});

addAccountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const platform = document.getElementById("platform").value;
  const username = document.getElementById("username").value.trim();
  if (!username) return showMessage("Username is required", true);

  createAccount(platform, username);
  addAccountForm.reset();
});

refreshBtn.addEventListener("click", fetchDashboard);

socket.on("connect", () => {
  console.log("Socket.IO connected");
});

socket.on("newAccount", fetchDashboard);
socket.on("metricsUpdate", fetchDashboard);
socket.on("accountDeleted", fetchDashboard);

fetchDashboard();
