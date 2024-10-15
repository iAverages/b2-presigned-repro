const form = document.getElementById("file-upload");

const renameFile = (originalFile, newFileName) => {
  return new File([originalFile], newFileName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

const getPresignedUrl = async (type, ext) => {
  const response = await fetch(`/generate?ext=${ext}&type=${type}`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

form.onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("file");
  const type = document.getElementById("upload-type").value;
  const file = fileInput.files[0];

  if (!file) {
    console.log("No file selected");
    return;
  }

  const fileExtension = file.name.split(".").pop();

  const data = await getPresignedUrl(type, fileExtension);
  const renamedFile = renameFile(file, data.name);

  await fetch(data.url, {
    method: "PUT",
    body: renamedFile,
    headers: {
      "Content-Type": renamedFile.type,
    },
  });
};
