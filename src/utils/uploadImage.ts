// src/utils/uploadImage.ts

export async function uploadImageToImgbb(file: File): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // We'll set this in Step 2

  if (!apiKey) {
    console.error('Imgbb API Key is not set in environment variables.');
    return null;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Imgbb Upload Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    console.log('Imgbb Response:', data);

    // Return the display_url from the response, which is the direct link to the image
    return data.data.display_url;
  } catch (error) {
    console.error('Error uploading image to Imgbb:', error);
    return null;
  }
}