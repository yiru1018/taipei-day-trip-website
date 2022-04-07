from flask import *
from pool import pool
import tappay

order=Blueprint("order",__name__)

client = tappay.Client(True, "partner_I7R7IwAuqGJtDr8z4fCYu7WYuiyDxeD5WFauL25802oUFpybJxuAmE0N", "debere11_TAISHIN")

@order.route("/api/orders", methods=["POST"])
def pay_for_order():
    if session.get("email")==None:
        return jsonify({"error": True, "message": "請先登入"}),403

    order=request.json.get("order")
    order_number=123456+order["trip"]["attraction"]["id"]
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
        print("Error:", e)
        return jsonify({"error": True, "message": "訂單建立失敗"}),400
    finally:
        con.close()
    prime_token=request.json.get("prime")
    card_holder_data = tappay.Models.CardHolderData(phone, name, email)
    response_data_dict = client.pay_by_prime(prime_token, 100, "Taishin Bank", card_holder_data)    
   
    if response_data_dict["status"]==0:
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
    # print("msg",response_data_dict["msg"])
    # print("status",response_data_dict["status"])
    return jsonify({"data":{"number":order_number,"payment":{"status":status,"message":message}}})

@order.route("/api/order/<orderNumber>", methods=["GET"])
def get_order_info():
    return

# @order.errorhandler(500)
# def internal_error(error):
#     result={"error":True,
#             "message":"伺服器錯誤"}
#     return jsonify(result), 500