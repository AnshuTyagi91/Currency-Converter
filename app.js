// --- Constants
const apiKey = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
const amountInput = document.querySelector(".amount input");
const fromSelect = document.querySelector("select[name='from']");
const toSelect = document.querySelector("select[name='to']");
const msgEl = document.querySelector(".msg");
const form = document.querySelector("form");

// --- Populate selects
function populateSelects() {
  const codes = Object.keys(countryList);

  codes.forEach((code) => {
    const fromOption = document.createElement("option");
    fromOption.value = code;
    fromOption.textContent = code;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = code;
    toOption.textContent = code;
    toSelect.appendChild(toOption);
  });

  // Default: from USD, to INR
  fromSelect.value = "USD";
  toSelect.value = "INR";
  updateFlagImgs();
}

// --- Update flag images
function updateFlagImgs() {
  const fromCode = fromSelect.value;
  const fromCountry = countryList[fromCode];
  const toCode = toSelect.value;
  const toCountry = countryList[toCode];

  document.querySelector(".from .select-container img").src =
    `https://flagsapi.com/${fromCountry}/flat/64.png`;

  document.querySelector(".to .select-container img").src =
    `https://flagsapi.com/${toCountry}/flat/64.png`;
}

// --- Fetch exchange rate (example using a popular API; you can switch)
async function getExchangeRate(from, to) {
  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${from}`
    );
    const data = await res.json();

    if (data.result !== "success") {
      throw new Error(data.error_type || "Failed to fetch rates.");
    }

    if (data.rates[to] == null) {
      throw new Error(`Currency ${to} not supported.`);
    }

    return data.rates[to];
  } catch (err) {
    console.error("ExchangeRate-API error:", err);
    throw new Error(
      "Could not fetch rates. Check internet or try again later."
    );
  }
}

// --- Convert & display
async function handleConversion(e) {
  e.preventDefault();

  const amountStr = amountInput.value.trim();
  const amount = parseFloat(amountStr);

  if (!amount || amount <= 0) {
    msgEl.textContent = "Please enter a valid amount.";
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;

  if (from === to) {
    msgEl.textContent = `${amount.toFixed(2)}${from} = ${amount.toFixed(2)}${to}`;
    return;
  }

  msgEl.textContent = "Fetching...";
  try {
    const rate = await getExchangeRate(from, to);
    const result = (amount * rate).toFixed(2);
    msgEl.textContent = `${amount.toFixed(2)}${from} = ${result}${to}`;
  } catch (err) {
    msgEl.textContent = err.message;
  }
}

// --- Event listeners
fromSelect.addEventListener("change", () => {
  updateFlagImgs();
});

toSelect.addEventListener("change", () => {
  updateFlagImgs();
});

form.addEventListener("submit", handleConversion);

// --- Initialize on page load
document.addEventListener("DOMContentLoaded", populateSelects);