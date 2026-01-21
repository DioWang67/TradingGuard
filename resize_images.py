import os
from PIL import Image, ImageOps

source_dir = "TradingLogs"
target_dir = "StoreAssets"
target_size = (1280, 800)
background_color = (30, 30, 30) # Dark gray/black to match trading theme

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

files = [f for f in os.listdir(source_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

print(f"Found {len(files)} images in {source_dir}")

for filename in files:
    try:
        img_path = os.path.join(source_dir, filename)
        with Image.open(img_path) as img:
            # Create a new image with the target size and background color
            new_img = Image.new("RGB", target_size, background_color)
            
            # Calculate the resizing ratio to fit within target_size while maintaining aspect ratio
            img.thumbnail(target_size, Image.Resampling.LANCZOS)
            
            # Calculate position to center the image
            x = (target_size[0] - img.width) // 2
            y = (target_size[1] - img.height) // 2
            
            # Paste the resized image onto the background
            new_img.paste(img, (x, y))
            
            # Save
            name, ext = os.path.splitext(filename)
            target_path = os.path.join(target_dir, f"{name}_1280x800_letterbox.png")
            new_img.save(target_path, "PNG")
            print(f"Processed {filename} -> {target_path}")
            
    except Exception as e:
        print(f"Failed to process {filename}: {e}")

print("Done.")
