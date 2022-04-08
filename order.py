from flask import *
from pool import pool
import requests
import random

order=Blueprint("order",__name__)

@order.route("/api/orders", methods=["POST"])
def pay_for_order():
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403
    order=request.json.get("order")
    while True:
        order_number=random.randint(10000,99999)
        print(order_number)
        try:
            con=pool.get_connection()
            cursor=con.cursor()
            cursor.execute("SELECT number FROM orderlist WHERE number=%s",(order_number,))
            result=cursor.fetchone()
            print("rrrr",result)
        except Exception as e:
            print("Error:", e)
        finally:
            con.close()
        if result is None:
            break
    contact=order["contact"]
    phone=contact["phone"]
    name=contact["name"]
    email=contact["email"]
    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("UPDATE orderlist SET number=%s, status=%s WHERE email=%s",(order_number,1,session["email"][0],))
        cursor.execute("INSERT INTO contact (name, email, phone, number) VALUES(%s,%s,%s,%s)",(name, email, phone, order_number))
        con.commit()
    except Exception as e:
        print("Error", e)
        return jsonify({"error": True, "message": "訂單建立失敗"}),400
    finally:
        con.close()
    prime_token=request.json.get("prime")
    tap_post=  {
                "prime": prime_token,
                "partner_key": "partner_I7R7IwAuqGJtDr8z4fCYu7WYuiyDxeD5WFauL25802oUFpybJxuAmE0N",
                "merchant_id": "debere11_TAISHIN",
                "details":"TapPay Test",
                "amount": 100,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email":email,
                },
                "remember": False
                }  
    response_data=requests.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
                                    json.dumps(tap_post, ensure_ascii=False, encoding='utf-8'),
                                    headers={"Content-Type": "application/json",
                                            "x-api-key":"partner_I7R7IwAuqGJtDr8z4fCYu7WYuiyDxeD5WFauL25802oUFpybJxuAmE0N"})
    response=json.loads(response_data.text)
    if response["status"]==0:
        status=0
        message="付款成功"
        try:
            con=pool.get_connection()
            cursor=con.cursor()
            cursor.execute("UPDATE orderlist SET status=%s WHERE email=%s",(0,session["email"][0]))
            con.commit()
        except Exception as e:
            print("Error:", e)
        finally:
            con.close()
    else:
        status=1
        message="付款失敗"
    return jsonify({"data":{"number":order_number,"payment":{"status":status,"message":message}}})

@order.route("/api/order/<orderNumber>", methods=["GET"])
def get_order_info(orderNumber):
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403
    try:
        con=pool.get_connection()
        cursor=con.cursor(dictionary=True)
        cursor.execute("""SELECT * FROM orderlist WHERE number=%s""",(orderNumber,))
        orderlist=cursor.fetchone()
        cursor.execute("""SELECT id, name, address, image FROM info WHERE id=%s""",(orderlist["attractionId"],))
        info=cursor.fetchone()
        cursor.execute("""SELECT name,email,phone FROM contact WHERE number=%s""",(orderNumber,))
        contact=cursor.fetchone()
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
    response={"data":{"number":str(orderlist["number"]),"price":orderlist["price"],
                    "trip":info,"date":orderlist["date"],"time":orderlist["time"]},
              "contact":contact,"status":orderlist["status"]}
    return jsonify(response)

@order.errorhandler(500)
def internal_error(error):
    result={"error":True,
            "message":"伺服器錯誤"}
    return jsonify(result), 500