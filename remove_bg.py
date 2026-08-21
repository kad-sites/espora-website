import sys
try:
    from PIL import Image
    
    def make_transparent(img_path, out_path):
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        # Assume the top-left pixel is the background color
        bg_color = datas[0] 
        
        new_data = []
        for item in datas:
            # Check if color is close to background color
            if abs(item[0] - bg_color[0]) < 20 and abs(item[1] - bg_color[1]) < 20 and abs(item[2] - bg_color[2]) < 20:
                new_data.append((255, 255, 255, 0)) # Transparent
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(out_path, "PNG")
        print("Success")
        
    make_transparent("logo.png", "logo.png")
except ImportError:
    print("PIL not installed")
