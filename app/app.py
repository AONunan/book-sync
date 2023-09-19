import os
import json
from flask import Flask, render_template, request, send_file

app = Flask(__name__)

@app.route('/')
def hello_world():

   previously_synced_books = get_book_list()
   library = {}

   for author in os.listdir("/calibre"):
      author_path = f"/calibre/{author}"

      if((os.path.isdir(author_path)) and not(author.startswith("."))):
         library[author] = []

         for book in os.listdir(author_path):
            library[author].append(book)

   return render_template('index.html', library=library, previously_synced_books=previously_synced_books)

@app.route('/set', methods=['POST'])
def set_book_list():
   print("'set' API triggered")

   request_data = json.loads(request.data.decode('utf-8'))

   with open("/db/listofbooks.txt", "w") as file:
      file.write("\n".join(request_data["checkedCheckboxes"]))


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

if __name__ == '__main__':
   app.run()
