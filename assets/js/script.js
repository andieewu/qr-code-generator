let currentCanvas = null;

function switchTab(tab) {
  const wifiForm = document.querySelector("form");
  const urlForm = document.getElementById("urlForm");

  const wifiTab = document.getElementById("wifiTab");
  const urlTab = document.getElementById("urlTab");

  const formTitle = document.getElementById("formTitle");

  document.getElementById("output").classList.add("hidden");

  clearInputAnimations(
    document.getElementById("ssid"),
    document.getElementById("password"),
    document.getElementById("urlInput")
  );

  if (tab === "wifi") {
    wifiForm.classList.remove("hidden");
    urlForm.classList.add("hidden");
    wifiTab.classList.add("bg-white", "text-gray-900", "shadow");
    urlTab.classList.remove("bg-white", "text-gray-900", "shadow");
    formTitle.textContent = "WiFi QR Code Generator";
  } else {
    wifiForm.classList.add("hidden");
    urlForm.classList.remove("hidden");
    urlTab.classList.add("bg-white", "text-gray-900", "shadow");
    wifiTab.classList.remove("bg-white", "text-gray-900", "shadow");
    formTitle.textContent = "URL QR Code Generator";
  }
}

function showWarning(message) {
  const warningDiv = document.getElementById("warningMessage");
  warningDiv.innerText = message;
  warningDiv.className = "warning";

  setTimeout(() => {
    warningDiv.className = "hidden";
  }, 3000);
}

function showSuccess(message) {
  const successDiv = document.getElementById("successMessage");
  successDiv.innerText = message;
  successDiv.className = "success";

  setTimeout(() => {
    successDiv.className = "hidden";
  }, 3000);
}

function togglePasswordInput() {
  const encryption = document.getElementById("encryption").value;
  const passwordContainer = document.getElementById("passwordContainer");
  encryption === "nopass"
    ? passwordContainer.classList.add("hidden")
    : passwordContainer.classList.remove("hidden");
}

function generateQR() {
  const ssidEl = document.getElementById("ssid");
  const passwordEl = document.getElementById("password");
  const encryption = document.getElementById("encryption").value;

  const ssid = ssidEl.value.trim();
  const password = passwordEl.value.trim();

  let isValid = true;

  if (!ssid) {
    resetAnimation(ssidEl, "shake");
    showWarning("SSID WiFi harus diisi.");
    isValid = false;
  } else {
    ssidEl.classList.remove("shake", "border-red-500");
  }

  if (encryption !== "nopass" && !password && !ssid) {
    resetAnimation(passwordEl, "shake");
    showWarning("SSID dan Password harus diisi agar bisa generate.");
    isValid = false;
  } else {
    passwordEl.classList.remove("shake", "border-red-500");
  }

  if (!isValid) return;

  let wifiString = `WIFI:T:${encryption};S:${ssid};`;
  if (encryption !== "nopass") {
    wifiString += `P:${password};`;
  }
  wifiString += ";";

  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";

  QRCode.toCanvas(
    wifiString,
    {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    },
    function (err, canvas) {
      if (err) {
        showWarning("Gagal membuat QR Code.");
        return;
      }

      canvas.style.borderRadius = "16px";
      canvas.style.overflow = "hidden";
      canvas.style.border = "1px solid #e5e7eb";

      canvas.style.opacity = "0";
      canvas.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        canvas.style.opacity = "1";
      }, 10);

      currentCanvas = canvas;
      qrDiv.appendChild(canvas);
      document.getElementById("output").classList.remove("hidden");
      showSuccess("QR Code berhasil dibuat!");
    }
  );
}

function generateURLQR() {
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();

  if (!url) {
    resetAnimation(urlInput, "shake");
    showWarning("URL tidak boleh kosong.");
    return;
  } else {
    urlInput.classList.remove("shake", "border-red-500");
  }

  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";

  QRCode.toCanvas(
    url,
    {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    },
    function (err, canvas) {
      if (err) {
        showWarning("Gagal membuat QR Code.");
        return;
      }

      canvas.style.borderRadius = "16px";
      canvas.style.overflow = "hidden";
      canvas.style.border = "1px solid #e5e7eb";

      currentCanvas = canvas;
      qrDiv.appendChild(canvas);
      document.getElementById("output").classList.remove("hidden");
      showSuccess("QR Code berhasil dibuat!");
    }
  );
}

function downloadQR() {
  if (!currentCanvas) return;
  const link = document.createElement("a");
  link.download = "wifi_qr.png";
  link.href = currentCanvas.toDataURL("image/png");
  link.click();
}

function resetAnimation(el, animationClass) {
  el.classList.remove(animationClass, "border-red-500");

  void el.offsetWidth;

  el.classList.add(animationClass, "border-red-500");
}

function clearInputAnimations(...inputs) {
  inputs.forEach((input) => {
    input.classList.remove("shake", "border-red-500");
  });
}

window.onload = () => {
  togglePasswordInput();
  switchTab("wifi");
};
