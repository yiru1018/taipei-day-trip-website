import mysql.connector.pooling

dbconfig={
    "host":"localhost",
    "user":"root",
    "password":"qwe101811",
    "database":"taipei_attractions"
}
pool=mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", 
                                                    pool_size=5,
                                                     **dbconfig)