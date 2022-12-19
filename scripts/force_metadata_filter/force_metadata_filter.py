import os
import psycopg2

COLLECTION_ADDRESS = '0x7D9148F5ba0520Eb4e8A3073938Cf383Fc9bF390'

# Get environment variables for API
API_USER = os.getenv('API_USER')
API_PASSWORD = os.environ.get('API_PASSWORD')
API_STRING = os.getenv('API_STRING')
API_TARGET = os.environ.get('API_TARGET')

#API DB connection
apiCon = psycopg2.connect(database=API_TARGET,
                        host=API_STRING,
                        user=API_USER,
                        password=API_PASSWORD,
                        port="5432")

#SQL queries to be executed
sqlAPI = f'''SELECT imx FROM imx_balance WHERE ether_key=lower('{COLLECTION_ADDRESS}')'''

sqlEngine = f'''select a.stark_key, v.id, v.quantized_balance, a.ether_key from accounts a
inner join vaults v
    on a.stark_key = v.stark_key
where
    a.ether_key = lower('{COLLECTION_ADDRESS}') and v.quantized_balance > 1;'''

cursorAPI = apiCon.cursor()
cursorAPI.execute(sqlAPI)
api_value = cursorAPI.fetchall()[0][0]

cursorEng = engineCon.cursor()
cursorEng.execute(sqlEngine)
engine_value = cursorEng.fetchall()[0][0]

print('API Value is:')
print(api_value)
print(api_value / 1000000000000000000)

print('Engine Value is:')
print(engine_value)
print(engine_value / 1000000000000000000)

apiCon.commit()
apiCon.close()



