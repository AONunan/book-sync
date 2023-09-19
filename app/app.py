import os
import json
from flask import Flask, render_template, request, send_file

app = Flask(__name__)

@app.route('/')
def hello_world():

   previously_synced_books = get_book_list()
   library = []

   for author in os.listdir("/calibre"):
      author_path = f"/calibre/{author}"

      if((os.path.isdir(author_path)) and not(author.startswith("."))):

         for book in os.listdir(author_path):

            library.append({
               "author": author,
               "title": book,
               "previously_synced": book in previously_synced_books
            })
   
   library = sorted(library, key=lambda x: x["previously_synced"], reverse=True)

   return render_template('index.html', library=library, previously_synced_books=previously_synced_books)

@app.route('/set', methods=['POST'])
def set_book_list():
   print("'set' API triggered")

   request_data = sorted(json.loads(request.data.decode('utf-8')))
   request_data = json.loads(request.data.decode('utf-8'))

   books_to_sync = request_data["checkedCheckboxes"]
   books_to_sync.sort()

   with open("/db/listofbooks.txt", "w") as file:
      file.write("\n".join(books_to_sync))


   return "Book list updated"

@app.route('/get')
def get_book_list():

   print("'get' API triggered")

   books = []
   with open("/db/listofbooks.txt", "r") as file:
      for line in file:
         books.append(line.strip())

   return json.dumps(books)

@app.route('/styles.css')
def server_css():
   return send_file("styles.css")

@app.route('/script.js')
def server_javascript():
   return send_file("script.js")

if __name__ == '__main__':
   app.run()
