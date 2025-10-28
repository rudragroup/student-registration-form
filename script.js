const scriptURL = "https://script.google.com/macros/s/AKfycbw2fKsf80tn8upWfX15hX2D_C2Df-OPrXI-1eB5jkACHPcn_5bpI1w43TKihqXlK5W-/exec";

/**
 * Show/hide "Other" input fields based on selection
 */
function handleOther(selectField, otherInput) {
  selectField.addEventListener("change", () => {
    if (selectField.value === "Other") {
      otherInput.classList.remove("hidden");
      otherInput.required = true;
      otherInput.focus();
    } else {
      otherInput.classList.add("hidden");
      otherInput.required = false;
      otherInput.value = "";
    }
  });
}

// Apply to all "Other" fields
["education", "category", "paymentMode"].forEach(id => {
  handleOther(
    document.getElementById(id),
    document.getElementById(id + "Other")
  );
});

/**
 * Handle form submission
 */
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById("formStatus");
  statusEl.textContent = "";

  // Collect form data
  const formData = {};
  [...form.elements].forEach(el => {
    if (!el.name) return;
    if ((el.type === "radio" && el.checked) || el.type !== "radio") {
      formData[el.name] = el.value.trim();
    }
  });

  // Validate contact number (10 digits)
  if (!/^\d{10}$/.test(formData.contact)) {
    statusEl.textContent = "Invalid contact number";
    return;
  }

  // Validate Aadhar number (12 digits)
  if (!/^\d{12}$/.test(formData.aadhar)) {
    statusEl.textContent = "Invalid Aadhar number";
    return;
  }

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.result === "success") {
      statusEl.textContent = "Registration successful!";
      form.reset();
      // Hide all "Other" inputs after reset
      ["educationOther", "categoryOther", "paymentModeOther"].forEach(id => {
        const el = document.getElementById(id);
        el.classList.add("hidden");
        el.required = false;
      });
    } else {
      statusEl.textContent = result.message || "Error submitting form";
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    statusEl.textContent = "Network error. Try again.";
  }
}

// Attach submit handler
document.getElementById("registrationForm").addEventListener("submit", handleSubmit);

