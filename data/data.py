import json, sys, re

sys.path.append(".")
from pool import pool

#load taipei-attrctions data
file=open("data/taipei-attractions.json")
data = json.load(file)

# insert attactions data into database
data_len=len(data["result"]["results"])
for i in range(0, data_len):
    data_list=data["result"]["results"][i]
    
    name=data_list["stitle"]
    category=data_list["CAT2"]
    descreption=data_list["xbody"]
    address=data_list["address"]
    transport=data_list["info"]
    mrt=data_list["MRT"]
    latitude=float(data_list["latitude"])
    longitude=float(data_list["longitude"])
    image_not_split=re.findall('http.+jpg|png$',data_list["file"],flags=re.I)
    image=["http"+e for e in image_not_split[0].split("http")]
    image.remove("http")

    try:
        con=pool.get_connection()
        cursor=con.cursor()
        cursor.execute("""
            INSERT INTO info(name,category,descreption,address,transport,mrt,latitude,
            longitude,image) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (name,category,descreption,address,transport,mrt,latitude,
            longitude,str(image)))
        con.commit()
    except Exception as e:
        print("Error:", e)
    finally:
        if con.in_transaction:
            con.rollback()
        con.close()
