// Uploads an image file to ImgBB and returns the hosted URL
export async function uploadImageToImgBB(imageFile) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Check NEXT_PUBLIC_IMGBB_API_KEY in .env.local");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.data.url;
}