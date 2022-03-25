from flask import *
from pool import pool


user=Blueprint("user",__name__)
@user.route("/api/user", methods=["GET"])
def get_user_data():
    email=""
    print(email)
    if "email" in session:
        email = session["email"][0]        
    try:
        con=pool.get_connection()
        cursor=con.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email FROM members WHERE email=%s",(email,))
        member_data=cursor.fetchone()
        print(member_data)                                            
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
        
    response=jsonify({"data":member_data}),200
    return response

@user.route("/api/user", methods=["POST"])
def signup():
    name=request.json.get("name")
    email=request.json.get("email")
    password=request.json.get("password")
    
    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("SELECT email FROM members WHERE email=%s",(email,))
        check_email=cursor.fetchone()                                               
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()

    if check_email:
        response=jsonify({"error":True, "message":"此信箱已經被使用"}), 400
    else:
        try:
            con=pool.get_connection()
            cursor=con.cursor()
            cursor.execute("INSERT INTO members (name, email, password) VALUES (%s, %s, %s)",(name, email, password))
            con.commit()                                           
        except Exception as e:
            print("Error:", e)
        finally:
            con.close()
        response =jsonify({"ok":True}),200
    return response


@user.route("/api/user", methods=["PATCH"])
def signin():
    email=request.json.get("email")
    password=request.json.get("password")
    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("SELECT email FROM members WHERE email=%s AND password=%s",(email, password))
        email=cursor.fetchone()                                               
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
        
    if email:
        session["email"]=email
        response=jsonify({"ok":True}),200
    else:
        response=jsonify({"error":True, "message":"登入失敗，電子信箱或密碼錯誤"}), 400
        
    return make_response(response) 

@user.route("/api/user", methods=["DELETE"])
def signout():
    session.pop('email',None)
    response=jsonify({"ok":True}),200
    return response

@user.errorhandler(500)
def internal_error(error):
    result={"error":True,
            "message":"伺服器錯誤"}
    return jsonify(result), 500