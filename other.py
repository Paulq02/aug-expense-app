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
   


@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    my_list.clear()
    
  

    user_id = session.get("user_id")
    username = session.get("username")
    password = session.get("password")
    
    sql = "SELECT expense_id, expense_name, expense_cost, expense_date FROM expense_tracker_expense_data WHERE user_id = %s AND username = %s ORDER BY expense_date DESC "
    username_tuple = (user_id,username)

    cursor.execute(sql, username_tuple)
    results = cursor.fetchall()
    print(f"THESE ARE YOUR RESULTS ----> {results}")
    if not results:
        return render_template('first_login.html', username=str(username).capitalize())
    
    for data in results:
        expense_id_row = data[0] # type: ignore
        expense_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore
    
        date_from_db = data[3] # type: ignore
        
        formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
       
       
        my_list.append({"expense_id":expense_id_row, "expense":expense_row, "amount":amount_row, "date":formatted_date})
        
        

    

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()

    entries = get_entries()
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize())
    





@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    entries = get_entries()
    expense = request.form.get("expense")
    amount = float(request.form.get("amount", 0))
    date = request.form.get("date")
    cursor = sql_connect.cursor()
    user_id = session.get("user_id")
    print(user_id)
    username = session.get("username")
    password = session.get("password")
    """sql = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s"
    cursor.execute(sql, (username, password))"""
    
    cursor.execute("INSERT INTO expense_tracker_expense_data (user_id, expense_name, expense_cost, expense_date) VALUES (%s, %s, %s, %s)", (user_id, expense, amount, date))
    sql_connect.commit()
    cursor.close()
    entries += 1
    
    
    
    
    return redirect(url_for('dashboard', username=username))


@app.route('/add_expense/', methods=["GET", "POST"])

def add_expense():
    username = session["username"]
    return render_template('add_expense.html', username=username)



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




@app.route('/delete_expense/<int:expense_id>', methods = ['POST', 'GET'])
def delete_expense(expense_id):
    user_id = session["user_id"]
    cursor = sql_connect.cursor()
    sql = "DELETE FROM expense_tracker_expense_data WHERE expense_id = %s AND user_id = %s "
    cursor.execute(sql, (expense_id,user_id))
    sql_connect.commit()
    return redirect(url_for('dashboard'))

@app.route('/users/<name>')
def user(name):
	return "<h3>Welcome {}</h3>".format(name)


@app.route('/update_name/<int:index>/<int:expense_id>', methods=["GET", "POST"])
def update_name(index, expense_id):
    user_id = session["user_id"]
    new_name = request.form[f"new-name-input-{index}"]
    sql_update_name = "UPDATE expense_tracker_expense_data SET expense_name  = %s WHERE expense_id = %s AND user_id = %s "
    cursor.execute(sql_update_name, (new_name,expense_id, user_id ))
    sql_connect.commit()
    return redirect(url_for('dashboard'))




@app.route("/update_cost/<int:index>/<int:expense_id>", methods=["GET", "POST"])
def update_cost(index, expense_id):
    user_id = session["user_id"]
    new_amount = request.form[f"new-cost-input-{index}"]
    sql_update_cost = "UPDATE expense_tracker_expense_data SET expense_cost = %s WHERE expense_id = %s AND user_id = %s"
    cursor.execute(sql_update_cost, (new_amount,expense_id,user_id ))

    sql_connect.commit()

    return redirect(url_for('dashboard'))




@app.route("/update_date/<int:index>/<int:expense_id>", methods=["GET", "POST"])
def update_date(index, expense_id):
    user_id = session["user_id"]
    new_date = request.form[f"new-date-input-{index}"]
    sql_date = "UPDATE expense_tracker_expense_data SET expense_date = %s WHERE expense_id = %s AND user_id = %s"
    cursor.execute(sql_date, (new_date,expense_id, user_id ))
    sql_connect.commit()
    return redirect(url_for('dashboard'))




   




@app.route("/signup", methods=["GET", "POST"])
def signup_page():
    
    return render_template("signup.html")






   
    





#SIGNUP FUNCTION NEEDS TO BE DONE!! FOCUS ON THE SIGNUP FIRST


@app.route("/submit", methods=["GET", "POST"])
def create_account():
    
    username = request.form.get("username").lower().rstrip() # type: ignore
    email = request.form.get("email").lower().rstrip() # type: ignore
    password = request.form.get("password").rstrip() # type: ignore
    


    sql = "INSERT INTO expense_tracker_users (username, email, password) VALUES (%s, %s, %s)"
    values = (username, email, password)
    cursor.execute(sql, values)
    sql_connect.commit()
    sql_get_user_id = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s"
    cursor.execute(sql_get_user_id, (username, password))
    #results = cursor.fetchone()
    #session["username"] = username
    #session["password"] = password
    #my_id = session["user_id"] = results[0] # type: ignore
   
    #create_session()
    
    
    return redirect(url_for("dashboard"))
   
# ================== LOGOUT FUNCTION ================== # 


@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return redirect(url_for('home_page'))  # Redirect to login page










#SORT BY DATE 
@app.route("/ascending", methods = ["GET", "POST"])
def sort_date_asc():
    my_list.clear()
    username = session["username"]
    user_id = session["user_id"]
    sql_sort_query = "SELECT expense_id, expense_name, expense_cost, expense_date FROM expense_tracker_expense_data WHERE user_id = %s ORDER BY expense_date ASC;"

    cursor.execute(sql_sort_query, (user_id,))
    results = cursor.fetchall()
    for data in results:
        expense_id_row = data[0] # type: ignore
        expense_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore
    
        date_from_db = data[3] # type: ignore
        
        formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
        my_list.append({"expense_id":expense_id_row, "expense":expense_row, "amount":amount_row, "date":formatted_date})

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()

    entries = get_entries()
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize())
    
       
       
       

def create_session(username_input, password_input):
   
    
   

    sql_user_id = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s;"
    cursor.execute(sql_user_id, (username_input,password_input))
    results = cursor.fetchone()
    
    #You dont need to run a for loop!
    session["user_id"] = results
    session["username"] = username_input
    session["password"] = password_input
    user_id =  session["user_id"]
    username = session["username"] 
    password =  session["password"]
    
    
    


   
    
    return user_id, username, password
    

# LOGIN FUNCTION

@app.route('/login', methods=["GET", "POST"])
def login():
    username_input = request.form.get("username").lower().rstrip() # type: ignore
    password_input = request.form.get("password").rstrip() # type: ignore

    try:
        sql = "SELECT id, username, password FROM expense_tracker_users WHERE username = %s and password = %s"
        cursor.execute(sql, (username_input, password_input))
        results = cursor.fetchone()
        
        #not sure why these below I had to ignore squiggly line?
        user_id = results[0] # type: ignore
        saved_username = results[1] # type: ignore
        saved_password = results[2] # type: ignore
        
        if username_input == saved_username and password_input == saved_password:
            create_session(username_input=username_input, password_input=password_input)
          
            return redirect(url_for('dashboard'))

    
    except TypeError:
        error = "Incorrect Username or Password"
        return render_template('login_page.html', error=error )
    return ""
   

       
    
      
        
    
    










if __name__ == "__main__":
    app.run(debug=True)