FROM python:3.9

# download this'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx'
# COPY u2net.onnx /home/.u2net/u2net.onnx
ADD https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx /root/.u2net/u2net.onnx

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]