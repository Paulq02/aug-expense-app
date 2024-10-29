from flask import Flask, render_template, url_for, request, redirect

import mysql.connector
app = Flask(__name__)
sql_connect = mysql.connector.connect(user="root", password="95w696fX#", host="localhost", database="expense_data")

from datetime import datetime

my_list = []


cursor = sql_connect.cursor()



income = float(100000.00)

entries = len(my_list)


@app.route('/',  methods=["GET", "POST"])


def home_page():
    my_list.clear()
    
    cursor.execute("SELECT id, name, amount, date FROM oct_expenses")
    results = cursor.fetchall()
    for data in results:
        id_row = data[0] # type: ignore
        name_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore
        date_from_db = data[3] # type: ignore
        
        formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
       
       
        my_list.append({"id":id_row, "name":name_row, "amount":amount_row, "date":formatted_date})
        
        
    
    

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()

    entries = get_entries()
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries)


@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    entries = get_entries()
    name = request.form.get("name")
    amount = float(request.form.get("amount", 0))
    date = request.form.get("date")
    cursor = sql_connect.cursor()
    
    cursor.execute("INSERT INTO oct_expenses (name, amount, date) VALUES (%s, %s, %s)", (name, amount, date))
    sql_connect.commit()
    cursor.close()
    entries += 1
    
    
    
    
    return redirect(url_for('home_page'))


@app.route('/add_expense/', methods=["GET", "POST"])

def add_expense():

    return render_template('add_expense.html')



def expenses_total():
    total_expenses = 0
    for expense in my_list:
        amount = expense["amount"]
        total_expenses += amount
    return total_expenses

def calclulate_money_leftover():
    money_leftover = income - expenses_total()
    return float(money_leftover)


def get_entries():
    entries = len(my_list)
    return entries


"""@app.route('/delete_expense/<int:index>', methods=['POST','GET'])
def delete_expense(index):
    
    if 0 <= index < len(my_list):
        my_list.pop(index)
        
    
    
    return redirect(url_for('home_page', index=index, entries=entries))"""




@app.route('/delete_expense/<int:id>', methods = ['POST', 'GET'])
def delete_expense(id):
    cursor = sql_connect.cursor()
    cursor.execute("DELETE FROM oct_expenses WHERE id = %s ", (id,))
    sql_connect.commit()
    return redirect(url_for('home_page'))

@app.route('/users/<name>')
def user(name):
	return "<h3>Welcome {}</h3>".format(name)

"""def check_list():
    cursor = sql_connect.cursor()
    cursor.execute("SELECT id, name, amount FROM oct_expenses")
    results = cursor.fetchall()
    for data in results:
        id_row = data[0] # type: ignore
        name_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore

        my_entries.append({"id":id_row, "name":name_row, "amount":amount_row})

       """

        
      
@app.route('/update', methods=['POST', 'GET'])
def update_data():
    updated_name = request.form.get("new-date-input")
    print(updated_name)


update_data()





if __name__ == "__main__":
    app.run(debug=True)