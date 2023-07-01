from flask import Flask, render_template, redirect
import requests

app = Flask(__name__)
app.debug = True

# Set up the admin portal, called Pendragon
@app.route('/login', methods=['GET','POST'])
def login():
        print('login')
        return render_template('index.html')

if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)