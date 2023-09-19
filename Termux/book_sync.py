#!/usr/bin/python

import os
import shutil
import requests
import urllib.parse
from bs4 import BeautifulSoup


destination_dir = "/data/data/com.termux/files/home/storage/shared/book-sync"

response = requests.get("http://192.168.8.100:5000/get")

if(response.status_code == 200):
    book_list = response.json()
else:
    print(f"Response from server: {response.status_code}")
    exit()

book_list_titles = [] # Same as the above list but only includes book titles



print("Checking for books to be synced")
for book in book_list:
    author, title = book.split("/")
    book_list_titles.append(title)

    if not(os.path.isdir(f"{destination_dir}/{title}")):
        print(f"Syncing '{title}'... ")

        base_url = f"http://192.168.8.100:8001/{urllib.parse.quote(book)}"
        print(f"Downloading from: {base_url}")

        # Send an HTTP GET request to the directory URL
        response = requests.get(base_url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content to extract links to files
            soup = BeautifulSoup(response.text, "html.parser")

            # Loop through all links in the directory page
            for link in soup.find_all('a'):
                href = link.get('href')
                if href and not href.startswith('#'):  # Ignore anchors
                    # Create the absolute URL for the file
                    file_url = f"{base_url}/{href}"

                    # Extract the filename from the URL
                    filename = urllib.parse.unquote(os.path.basename(file_url))

                    if(filename != "metadata.opf"):

                        # Send an HTTP GET request to download the file
                        file_response = requests.get(file_url)
                        
                        # Check if the request was successful (status code 200)
                        if file_response.status_code == 200:
                            # Specify the directory where you want to save the downloaded files
                            download_dir = f"{destination_dir}/{title}"

                            # Create the directory if it doesn't exist
                            os.makedirs(download_dir, exist_ok=True)

                            # Specify the path for the downloaded file
                            file_path = os.path.join(download_dir, filename)

                            # Write the file content to the local file
                            with open(file_path, 'wb') as file:
                                file.write(file_response.content)

                            print(f"Downloaded: {filename}")
                        else:
                            print(f"Failed to download: {filename}")
        else:
            print(f"Failed to access the directory: {base_url}")



        print("Complete")
        print()

print()
print("Checking for books to be removed")
for dir_path, dir_names, file_names in os.walk(destination_dir):
    for dir_name in dir_names:
        if((dir_name not in book_list_titles) and (dir_name != "!Smart AudioBook Player Statistics")):
            print(f"Deleting '{dir_name}'... ")
            shutil.rmtree(f"{destination_dir}/{dir_name}")
            print("Complete")
            print()
