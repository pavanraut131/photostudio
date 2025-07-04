export async function uploadBlobToCloudinary(blob) {
  const cloudName = "dovr5w1zw"; // Replace with your Cloudinary cloud name
  const unsignedUploadPreset = "unsigned_preset"; // Replace with your unsigned upload preset

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", unsignedUploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url; // This is the URL of the uploaded image
}

export async function uploadBase64ToCloudinary(base64Image) {
  const cloudName = "dovr5w1zw"; // Replace with your Cloudinary cloud name
  const unsignedUploadPreset = "unsigned_preset"; // Replace with your unsigned upload preset

  const formData = new FormData();
  formData.append("file", base64Image); // base64 string like: "data:image/png;base64,...."
  formData.append("upload_preset", unsignedUploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

