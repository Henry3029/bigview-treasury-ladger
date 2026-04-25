// mobile/src/utils/uploadImage.ts

export async function uploadImageToImgbb(formData: FormData): Promise<string | null> {
  // Use EXPO_PUBLIC prefix for Expo environment variables
  const apiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY; 

  if (!apiKey) {
    console.error('Imgbb API Key is not set in EXPO_PUBLIC_IMGBB_API_KEY.');
    return null;
  }

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
      // Note: Do NOT set 'Content-Type' header manually. 
      // Fetch will automatically set it to 'multipart/form-data' with the correct boundary.
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Imgbb Upload Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Imgbb Response:', data);

    // Return the display_url from the response
    return data.data.display_url;
  } catch (error) {
    console.error('Error uploading image to Imgbb:', error);
    return null;
  }
}