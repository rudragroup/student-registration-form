// Replace this with your deployed Web App URL (make sure it ends with /exec)
const scriptURL = "https://script.google.com/macros/s/AKfycbyjU7-k5bbPq6N435t2JNNhtK3iIn2FuxsTqMym1u2hbm-fB2BaaWE981a9Y9eSY2kN/exec";

// Handle showing and hiding "Other" inputs when selected
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

["education", "category"].forEach(id => {
  handleOther(
    document.getElementById(id),
    document.getElementById(id + "Other")
  );
});

// Show/hide payment mode based on payment status
const paymentStatus = document.getElementById('paymentStatus');
const paymentModeWrapper = document.getElementById('paymentModeWrapper');
const paymentMode = document.getElementById('paymentMode');

function togglePaymentMode() {
  if (paymentStatus.value === "Completed") {
    paymentModeWrapper.style.display = 'block';
    paymentMode.required = true;
  } else {
    paymentModeWrapper.style.display = 'none';
    paymentMode.required = false;
    paymentMode.value = '';
  }
}

// Initialize visibility on page load
window.addEventListener('DOMContentLoaded', togglePaymentMode);

// Toggle visibility on change
paymentStatus.addEventListener('change', togglePaymentMode);

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById("formStatus");
  statusEl.textContent = "Submitting...";

  const formData = {};
  [...form.elements].forEach(el => {
    if (!el.name) return;
    if ((el.type === "radio" && el.checked) || el.type !== "radio") {
      formData[el.name] = el.value.trim();
    }
  });

  if (!/^\d{10}$/.test(formData.contact)) {
    statusEl.textContent = "Invalid contact number";
    return;
  }

  if (!/^\d{12}$/.test(formData.aadhar)) {
    statusEl.textContent = "Invalid Aadhar number";
    return;
  }

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.result === "success") {
      statusEl.textContent = "Registration successful!";
      form.reset();
      ["educationOther", "categoryOther"].forEach(id => {
        const el = document.getElementById(id);
        el.classList.add("hidden");
        el.required = false;
      });
      togglePaymentMode(); // Reset payment mode visibility after reset
    } else {
      statusEl.textContent = result.message || "Error submitting form.";
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    statusEl.textContent = "Network error. Please try again.";
  }
}

document.getElementById("registrationForm").addEventListener("submit", handleSubmit);
