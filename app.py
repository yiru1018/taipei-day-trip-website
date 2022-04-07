from flask import *
from attractions import attractions
from user import user
from booking import booking
from order import order

app=Flask(__name__, static_folder='static')
app.secret_key="oppppppooop"
app.register_blueprint(attractions)
app.register_blueprint(user)
app.register_blueprint(booking)
app.register_blueprint(order)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(port=3000, host="0.0.0.0")