from flask import * 
from pool import pool

attractions=Blueprint("attractions",__name__)

def get_attractions_and_counts(str1,tuple1,str2,tuple2):
    try:
        con=pool.get_connection()
        cursor=con.cursor(dictionary=True)
        cursor.execute(str1, tuple1)
        get_attractions=cursor.fetchall()      
        cursor.execute(str2,tuple2)
        counts=cursor.fetchone()["count(*)"]                                          
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
    return get_attractions, counts

def count_next_page(counts,page):
    data_remainder=counts%12
    if data_remainder!=0:
        last_count=1
    else:
        last_count=0
    max_page=counts//12+last_count
        
    next_page=page+1
    if  next_page== max_page:
        next_page=None
    return next_page
    

@attractions.route("/api/attractions")
def get_attractions():    
    if request.args:
        args=request.args  
              
        if "page" and "keyword" in args:
            page=int(request.args.get("page"))
            keyword=request.args.get("keyword")
            
            str1="SELECT * FROM info WHERE name LIKE %s LIMIT %s,%s"
            tuple1=("%"+keyword+"%",page*12,12)
            str2="SELECT count(*) FROM info WHERE name LIKE %s "
            tuple2=(","+"%"+keyword+"%",)
            get_attractions, counts=get_attractions_and_counts(str1,tuple1,str2,tuple2)    
            next_page=count_next_page(counts,page)
            
        elif "page" in args:
            page=int(request.args.get("page"))
            
            str1="SELECT * FROM info LIMIT %s,%s"
            tuple1=(page*12,12)
            str2="SELECT count(*) FROM info"
            tuple2=()
            get_attractions, counts=get_attractions_and_counts(str1,tuple1,str2,tuple2)
            next_page=count_next_page(counts,page)
    
    return make_response(jsonify({"nextPage":next_page,"data":get_attractions}))

@attractions.route("/api/attraction/<attractionId>")
def get_attraction(attractionId):
    try:
        con=pool.get_connection()
        cursor=con.cursor(dictionary=True)
        cursor.execute("SELECT * FROM info WHERE id=%s",(int(attractionId),))
        attraction=cursor.fetchone()
    except Exception as e:
        print("Error:", e)
    finally:
        con.close()
        
    if not attractionId.isdigit() or attraction is None:
        result={"error":True,
                    "message":"景點編號不正確"}
        response=jsonify(result),400 
    else:                  
        response=jsonify({"data":attraction}),200 
    return response

@attractions.errorhandler(500)
def internal_error(error):
    result={"error":True,
            "message":"伺服器錯誤"}
    return jsonify(result), 500
