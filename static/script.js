document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");
  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
      enableBtn(e);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element and enables the submit button.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so let's create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      enableBtn(); // Enable the submit button
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

/**
 * Enables the submit button.
 */
function enableBtn() {
  let submitBtn = document.querySelector(".submit-btn");
  submitBtn.style.display = "block";
}

/**
 * Disables the submit button and shows the loader.
 */
function disableBtn() {
  let submitBtn = document.querySelector(".submit-btn");
  let loader = document.querySelector(".loader");
  submitBtn.style.display = "none";
  loader.style.display = "block";
}

// Attach event listener to the form submission
document.querySelector("form").addEventListener("submit", (e) => {
  disableBtn(); // Disable submit button and show loader
  let formData = new FormData(document.querySelector("form"));
  fetch("/", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // Handle response - clear input and thumbnail, hide loader, enable submit button again
      document.querySelector(".submit-btn").style.display = "none"; // Hide submit button
      document.querySelector(".loader").style.display = "none"; // Hide loader
    })
    .catch((error) => console.error("Error:", error));
});
