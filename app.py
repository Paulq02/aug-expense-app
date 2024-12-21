from flask import Flask, render_template, url_for, request, redirect, session




import mysql.connector
app = Flask(__name__)
sql_connect = mysql.connector.connect(user="root", password="95w696fX#", host="localhost", database="expense_data")

from datetime import datetime


app.secret_key = "padthai123Z$meme"

my_list = []


cursor = sql_connect.cursor()



income = float(4500.00)

entries = len(my_list)


@app.route('/',  methods=["GET", "POST"])


def home_page():
    my_list.clear()
    
    return render_template('login_page.html')
    """ results = cursor.fetchall()
    for data in results:
        id_row = data[0] # type: ignore
        expense_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore
        date_from_db = data[3] # type: ignore
        
        formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
       
       
        my_list.append({"id":id_row, "expense":expense_row, "amount":amount_row, "date":formatted_date})
        
        
    
    

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()

    entries = get_entries()
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries)
    """

@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    entries = get_entries()
    expense = request.form.get("expense")
    amount = float(request.form.get("amount", 0))
    date = request.form.get("date")
    cursor = sql_connect.cursor()
    
    cursor.execute("INSERT INTO oct_expenses (expense-name, amount, date) VALUES (%s, %s, %s)", (expense, amount, date))
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

        

"""@app.route('/update/<int:id>/<int:index>', methods=['GET', 'POST'])
def update_data(id, index):
    updated_name = request.form.get(f"new-name-input-{index}")
    cursor.execute("UPDATE oct_expenses SET name = %s WHERE id = %s ", ((updated_name,id)))
    sql_connect.commit()
    return redirect(url_for('home_page'))
    """




@app.route('/update_name/<int:index>/<int:id>', methods=["GET", "POST"])
def update_name(index, id):
    new_name = request.form[f"new-name-input-{index}"]
    cursor.execute("UPDATE oct_expenses SET expense = %s WHERE id = %s", (new_name, id))
    sql_connect.commit()
    return redirect(url_for('home_page'))




@app.route("/update_cost/<int:index>/<int:id>", methods=["GET", "POST"])
def update_cost(index, id):
    new_amount = request.form[f"new-cost-input-{index}"]
    cursor.execute("UPDATE oct_expenses SET amount = %s WHERE id = %s",(new_amount, id))
    sql_connect.commit()

    return redirect(url_for('home_page'))




@app.route("/update_date/<int:index>/<int:id>", methods=["GET", "POST"])
def update_date(index, id):
    new_date = request.form[f"new-date-input-{index}"]
    cursor.execute("UPDATE oct_expenses SET date = %s WHERE id = %s", (new_date, id))
    sql_connect.commit()
    return redirect(url_for('home_page'))




   




@app.route("/signup", methods=["GET", "POST"])
def signup_page():
    
    return render_template("signup.html")





# LOGIN FUNCTION

@app.route('/checking', methods=["GET", "POST"])
def checkpassword():
    username_input = request.form.get("username")
    password_input = request.form.get("password")

    try:
        sql = "SELECT username, password FROM expense_tracker_users WHERE username = %s and password = %s"
        cursor.execute(sql, (username_input, password_input))
        results = cursor.fetchone()
        #not sure why these below I had to ignore squiggly line?
        saved_username = results[0] # type: ignore
        saved_password = results[1] # type: ignore
        if username_input == saved_username and password_input == saved_password:
            return render_template('first_login.html', username=saved_username)

    
    except TypeError:
        error = "Incorrect Username or Password"
        return render_template('login_page.html', error=error )
    return "lol"
   
   
    












#SIGNUP FUNCTION NEEDS TO BE DONE!! FOCUS ON THE SIGNUP FIRST


@app.route("/submit", methods=["GET", "POST"])
def create_account():
    
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm_password = request.form.get("confirm-password")

    sql = "INSERT INTO expense_tracker_users (username, email, password) VALUES (%s, %s, %s)"
    values = (username, email, password)
    cursor.execute(sql, values)
    sql_connect.commit()
    #cursor.close()
    return render_template('first_login.html', username=username)
   
# ================== LOGOUT FUNCTION ================== # 


@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return redirect(url_for('home_page'))  # Redirect to login page



# MUST WORK ON LOGIN FUNCTION !!! ONCE USER HAS CREATED AN ACCOUNT THEY CAN LOGIN, CHECK THE DATABASE FOR THEIR USERNAME AND PASSWORD




# IF THEY MATCH LOAD A PAGE 
# THEN USER CAN START ADDING EXPENSES SPECFIC TO THE USER 

if __name__ == "__main__":
    app.run(debug=True)