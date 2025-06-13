import os
from PIL import Image
from io import BytesIO
from rembg import remove
from flask import Flask, render_template, request, send_file

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'myFile' not in request.files:
            return 'No file uploaded', 400
        file = request.files['myFile']
        print(file)
        if file.filename == '':
            return 'No file selected', 400
        if file:
            input_image = Image.open(file.stream)
            output_image = remove(input_image, post_process_mask=True)
            img_io = BytesIO()
            output_image.save(img_io, 'PNG')
            img_io.seek(0)
            return send_file(img_io, mimetype='image/png', as_attachment=True, download_name=f'{file.filename}_rmbg.png')
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080)) 
    app.run(host='0.0.0.0', port=port)