import zipfile
import os

def extract_media():
    docx_path = r"c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Lesson_Plans\Lesson_25.2\Lesson Plan 25.2 Magazine Reading\Lesson_Plan_25.2_Magazine_Reading.docx"
    dest_dir = r"c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Lesson_Plans\Lesson_25.2\Lesson Plan 25.2 Magazine Reading\images"
    
    with zipfile.ZipFile(docx_path, 'r') as z:
        media_files = [f for f in z.namelist() if f.startswith('word/media/')]
        for f in media_files:
            filename = os.path.basename(f)
            data = z.read(f)
            # Let's see if this image already matches one of the three generated images by size or content,
            # or if it's the new one. Let's write them all as image1, image2, image3, image4 in a temp folder.
            temp_dir = r"c:\Users\dsuth\Documents\Joshua\scratch\extracted_media"
            os.makedirs(temp_dir, exist_ok=True)
            out_path = os.path.join(temp_dir, filename)
            with open(out_path, 'wb') as out:
                out.write(data)
            print(f"Extracted {f} to {out_path} ({len(data)} bytes)")

if __name__ == "__main__":
    extract_media()
