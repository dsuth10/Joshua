import os

def find_images():
    workspace = r"c:\Users\dsuth\Documents\Joshua"
    out_file = os.path.join(workspace, "scratch", "images_found.txt")
    with open(out_file, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(workspace):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".git" in dirs:
                dirs.remove(".git")
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in [".png", ".jpg", ".jpeg", ".gif"]:
                    full_path = os.path.join(root, file)
                    out.write(f"{file} | {full_path} | {os.path.getsize(full_path)} bytes\n")

if __name__ == "__main__":
    find_images()
