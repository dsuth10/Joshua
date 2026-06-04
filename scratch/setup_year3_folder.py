import os
import shutil

def setup_y3():
    base_dir = r"c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Lesson_Plans\Lesson_25.2"
    y3_dir = os.path.join(base_dir, "Lesson Plan 25.2 Magazine Reading Year 3")
    y3_images_dir = os.path.join(y3_dir, "images")
    
    os.makedirs(y3_images_dir, exist_ok=True)
    
    # Src paths
    y5_images_dir = os.path.join(base_dir, "Lesson Plan 25.2 Magazine Reading", "images")
    extracted_user_img = r"c:\Users\dsuth\Documents\Joshua\scratch\extracted_media\image3.jpeg"
    
    # 3 generated images
    gen_images = ["earthquake_damage.png", "plate_boundaries.png", "seismograph_recording.png"]
    for img in gen_images:
        src = os.path.join(y5_images_dir, img)
        dst = os.path.join(y3_images_dir, img)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {img} to Y3 images folder")
            
    # User's cross-section image
    if os.path.exists(extracted_user_img):
        dst_user = os.path.join(y3_images_dir, "earthquake_cross_section.jpeg")
        shutil.copy2(extracted_user_img, dst_user)
        print(f"Copied extracted user image to Y3 images folder as earthquake_cross_section.jpeg")
        
        # Also copy it to Year 5 images folder as earthquake_cross_section.jpeg for complete reference
        dst_y5_user = os.path.join(y5_images_dir, "earthquake_cross_section.jpeg")
        shutil.copy2(extracted_user_img, dst_y5_user)
        print(f"Copied extracted user image to Y5 images folder as earthquake_cross_section.jpeg")

if __name__ == "__main__":
    setup_y3()
