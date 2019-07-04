(function () {
  const postEditForm = document.querySelector('#postEditForm');
  postEditForm.addEventListener('submit', (event) => {
    const imageUploads = document.querySelector('#imageUpload').files.length;
    const existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    const imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    const newTotal = existingImgs - imgDeletions + imageUploads;
    if (newTotal > 4) {
      event.preventDefault();
      const removeAmt = newTotal - 4;
      alert(`You need to remove at least ${removeAmt} (more) image${removeAmt === 1 ? '' : 's'}.`);
    }
  });
})();
