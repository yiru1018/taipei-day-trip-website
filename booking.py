from flask import *
from pool import pool

booking=Blueprint("booking",__name__)

@booking.route("/api/booking", methods=["GET"])
def get_itinerary_data():
    print(session.get("email"))
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403    
    try:
        con=pool.get_connection()
        cursor=con.cursor(dictionary=True)
        cursor.execute("SELECT attractionId FROM orderlist WHERE email=%s",(session["email"][0],))
        id=cursor.fetchone()
        print(id)
        # if id==None:
        #     return jsonify({"data":None})
        cursor.execute("SELECT id, name, address, image FROM info WHERE id=%s",(id["attractionId"],))
        info=cursor.fetchone()
        info["image"]=eval(info['image'])
        cursor.execute("SELECT date, time ,price FROM orderlist WHERE email=%s",(session["email"][0],))
        order_info=cursor.fetchone()
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
    return jsonify({"data":{"attraction":info,"date":order_info["date"],
                            "time":order_info["time"],"price":order_info["price"]}}),200

@booking.route("/api/booking", methods=["POST"])
def establish_order():
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403
        
    id=request.json.get("attractionId")
    date=request.json.get("date")
    time=request.json.get("time")
    price=request.json.get("price")
    if id =="" or date =="" or time =="" or price =="":
        return jsonify({"error": True, "message": "輸入資料有誤或不可為空白"}),400
    
    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("SELECT email FROM orderlist WHERE email=%s",(session["email"][0],))
        orderlist_email=cursor.fetchone()
        print(orderlist_email)
        if orderlist_email:
            cursor.execute("DELETE FROM orderlist WHERE email=%s",(session["email"][0],))                                                  
        
        cursor.execute("""INSERT INTO orderlist (email, attractionId, date, time, price) 
                    VALUES (%s, %s, %s, %s, %s)""",(session["email"][0], id, date, time, price))
        con.commit()                                              
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
    return jsonify({"ok": True}),200

@booking.route("/api/booking", methods=["DELETE"])
def delete_order():
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403
    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("DELETE FROM orderlist WHERE email=%s",(session["email"][0],))
        con.commit()
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
    return jsonify({"ok": True}),200

# @booking.errorhandler(500)
# def internal_error(error):
#     result={"error":True,
#             "message":"伺服器錯誤"}
#     return jsonify(result), 500