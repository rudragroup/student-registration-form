const scriptURL = "https://script.google.com/macros/s/AKfycbzj2vtMinG_d5VPk2S2sA2_dSf11mDS9PgMeVpc_28p8EzuXYNg71RLvGWRk9Jdw_HQ/exec";

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

["education", "category", "paymentMode"].forEach(id =>
  handleOther(
    document.getElementById(id),
    document.getElementById(id + "Other")
  )
);

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById("formStatus");
  statusEl.textContent = "";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      statusEl.textContent = "Registration successful!";
      form.reset();
      // Hide all “Other” inputs after reset
      ["educationOther", "categoryOther", "paymentModeOther"].forEach(id => {
        const el = document.getElementById(id);
        el.classList.add("hidden");
        el.required = false;
      });
    } else {
      statusEl.textContent = "Error submitting form";
    }
  } catch {
    statusEl.textContent = "Network error. Try again.";
  }
}

document.getElementById("registrationForm").addEventListener("submit", handleSubmit);
