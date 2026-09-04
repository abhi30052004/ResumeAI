import urllib.request
import urllib.parse
url = 'http://localhost:8000/api/resumes/upload'
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = '--' + boundary + '\r\nContent-Disposition: form-data; name="name"\r\n\r\ntest.pdf\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n%PDF-1.4 mock content\r\n--' + boundary + '--\r\n'
req = urllib.request.Request(url, data=body.encode('utf-8'))
req.add_header('Content-Type', 'multipart/form-data; boundary=' + boundary)
try:
    response = urllib.request.urlopen(req)
    print(response.status, response.read().decode())
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode())
