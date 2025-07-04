import cloudinary
import cloudinary.uploader 


def upload_to_cloudinary(image_path):
            try:
                result = cloudinary.uploader.upload(image_path)
                print(f"Image uploaded to Cloudinary: {result['secure_url']}")
                return result['secure_url']
            except Exception as e:
                print("Cloudinary upload failed:", e)
                return None