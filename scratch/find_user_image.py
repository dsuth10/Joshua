import os

def find_user_images():
    workspace = r"c:\Users\dsuth\Documents\Joshua"
    out_file = os.path.join(workspace, "scratch", "user_image_log.txt")
    with open(out_file, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(workspace):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".git" in dirs:
                dirs.remove(".git")
            for file in files:
                name_lower = file.lower()
                ext = os.path.splitext(name_lower)[1]
                if ext in [".png", ".jpg", ".jpeg", ".gif"]:
                    if any(x in name_lower for x in ["earthquake", "cross", "section", "diagram", "figure", "fig"]):
                        full_path = os.path.join(root, file)
                        out.write(f"{file} | {full_path} | {os.path.getsize(full_path)} bytes\n")

if __name__ == "__main__":
    find_user_images()
