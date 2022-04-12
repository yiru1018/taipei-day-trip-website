import mysql.connector.pooling
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv()
find_dotenv()
dbconfig={
    "host":"localhost",
    "user":"root",
    "password":os.getenv("database_password"),
    "database":"taipei_attractions"
}
pool=mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", 
                                                    pool_size=5,
                                                     **dbconfig)