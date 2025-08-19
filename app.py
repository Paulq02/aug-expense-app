from flask import Flask, render_template, url_for, request, redirect, session
from datetime import datetime
import mysql.connector

import json



app = Flask(__name__)
sql_connect = mysql.connector.connect(user="root", password="95w696fX#", host="localhost", database="expense_data")




app.secret_key = "padthai123Z$meme"

my_list = []




cursor = sql_connect.cursor()



income = float(4500.00)

entries = len(my_list)

running_count = 0




@app.route('/',  methods=["GET", "POST"])



def home_page():
    my_list.clear()
    
    return render_template('login_page.html')
   



@app.route("/dashboard", methods = ['GET', 'POST'])
def dashboard():
    global running_count
    view_mode = "dashboard"
   
   
    
    

    my_list.clear()
   
    user_id = session.get("user_id")
    username = session.get("username")
    
    password = session.get("password")

    asc_or_desc = request.args.get("sortOrder", "desc")
    
   
    offset = int(request.args.get("offset", 0))
   
   


   
   
    
    user_year_selection = request.args.get("year", "none")
    

    
   
    
    
    sql_complete_results = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s"
    cursor.execute(sql_complete_results,(user_id,))
    complete_results = cursor.fetchall()
    complete_results_amount = len(complete_results)
    complete_results_amount = int(complete_results_amount)
    
    
    
   
    


    
    sql = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s "
    cursor.execute(sql, (user_id,offset))
    results = cursor.fetchall()
    max_10_results_amount = len(results)
    max_10_results_amount = int(max_10_results_amount)
    
    
    
    running_count = offset + max_10_results_amount


           
            



    

   

    
   
    
    if not results:
        return render_template('first_login.html', username=str(username).capitalize())
    
    for data in results:
        expense_id_row = data[0] # type: ignore
        expense_row = data[1] # type: ignore
        amount_row = float(data[2]) # type: ignore
        
        date_from_db = data[3] # type: ignore

        expense_category_row = data[4] # type: ignore
        
        formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
        
        
        
        my_list.append({"expense_id":expense_id_row, "expense_name":expense_row, "amount":amount_row, "expense_date":formatted_date,  "expense_category":expense_category_row})
        
   
       
    my_json= json.dumps(my_list)
    



        

    

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()

    entries = get_entries()

   

   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize(), user_year_selection=user_year_selection, my_json=my_json, offset=offset, max_10_results_amount=max_10_results_amount, complete_results_amount= complete_results_amount, asc_or_desc = asc_or_desc, view_mode = view_mode, running_count = running_count)








@app.route('/sort_by_year', methods=["POST", "GET"])
def sort_year():
    global running_count
    
    """
    Sorts Expense Dates by Year 
    
    Keyword arguments:

    None -- (Uses request arguments and session data)
    
    Return:

    None  


    """
    view_mode = "sort-year"

    #running_count = 0
    my_list.clear()
    username = session.get("username")
    user_id = session.get("user_id")
    
    
    asc_or_desc = request.args.get("sortOrder","desc")
   
    
    user_year_selection = request.args.get("year","none")

    offset = request.args.get("offset", 0)

    offset = int(offset)
    
    
    
    if user_year_selection == "all" :

        sql_complete_results = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s"
        cursor.execute(sql_complete_results,(user_id,))
        fetched_results = cursor.fetchall()
        complete_results_amount = len(fetched_results)



        sql_all_expenses = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s"
        cursor.execute(sql_all_expenses,(user_id,offset))
        results = cursor.fetchall()
        max_10_results_amount = len(results)
        max_10_results_amount = int(max_10_results_amount)

       
        running_count = offset + max_10_results_amount
            
            
        
        for data in results:
            expense_id = data[0] # type: ignore
            expense_name = data[1] # type: ignore
            expense_cost = float(data[2]) # type: ignore
            expense_date = data[3]# type: ignore
            expense_category = data[4]# type: ignore
            
            converted_date = expense_date.strftime("%m-%d-%Y") # type: ignore
            my_list.append({"expense_id":expense_id,"expense_name":expense_name, "amount":expense_cost, "expense_date":converted_date, "expense_category": expense_category})
        
        
        
    else:



        sql_specifc_year_query = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s"
        cursor.execute(sql_specifc_year_query,(user_id,user_year_selection))
        specific_year_results = cursor.fetchall()
        specific_year_complete_results_amount = len(specific_year_results)
       



        sql_year_expenses = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s"
        cursor.execute(sql_year_expenses,(user_id,user_year_selection,offset))
        results = cursor.fetchall()
        
        max_10_results_amount = len(results)
        max_10_results_amount = int(max_10_results_amount)

       
       
        running_count = offset + max_10_results_amount



        for data in results:
            expense_id = data[0] # type: ignore
            expense_name = data[1] # type: ignore
            expense_cost = float(data[2]) # type: ignore
            expense_date = data[3]# type: ignore
            expense_category = data[4]# type: ignore
            
            converted_date = expense_date.strftime("%m-%d-%Y") # type: ignore
            my_list.append({"expense_id":expense_id,"expense_name":expense_name, "amount":expense_cost, "expense_date":converted_date, "expense_category": expense_category})
            
       
        sql_complete_results = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s"
        cursor.execute(sql_complete_results,(user_id,user_year_selection))
        fetched_results = cursor.fetchall()
        complete_results_amount = len(fetched_results)
        
        


        
    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
    entries = get_entries()
            
    my_json= json.dumps(my_list)
    
        
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize(),  user_year_selection=user_year_selection, asc_or_desc = asc_or_desc, my_json=my_json, offset = offset, max_10_results_amount = max_10_results_amount, view_mode = view_mode, complete_results_amount = complete_results_amount, running_count = running_count)

      
  

    

@app.route("/sort_cost", methods=["GET", "POST"])
def sort_by_cost():
    global running_count
    my_list.clear()

    view_mode = "sort-cost"

    #add_to_results = request.args.get("add-results", 10)

    #add_to_results = int(add_to_results)
    username = session.get("username").capitalize()
    
    offset = request.args.get("offset", 0)
    offset = int(offset)
   
    
    
    
    user_id = session.get("user_id")
    sort_expense_order = request.args.get("sort-expense", None)

    sql_select_all = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s"
    cursor.execute(sql_select_all,(user_id,))
    sql_all_results = cursor.fetchall()
    complete_results_amount = len(sql_all_results)
    complete_results_amount = int(complete_results_amount)


    
    

    sql_sort_cost = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s ORDER BY expense_cost {sort_expense_order.upper()} LIMIT 10 OFFSET %s "
    cursor.execute(sql_sort_cost, (user_id,offset))
    results = cursor.fetchall()

    max_10_results_amount= len(results)
    max_10_results_amount = int(max_10_results_amount)


    running_count = offset + max_10_results_amount

            


    for expense in results:
      expense_id = expense[0] # type: ignore
      expense_name = expense[1] # type: ignore
      expense_cost = float(expense[2]) # type: ignore
      expense_date = expense[3] # type: ignore
      expense_category = expense[4] # type: ignore
      converted_date = datetime.strftime(expense_date,"%m-%d-%Y") # type: ignore
      my_list.append({"expense_id":expense_id, "expense_name":expense_name, "amount":expense_cost, "expense_date":converted_date, "expense_category": expense_category})

    
    my_json= json.dumps(my_list)

      
    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
    entries = get_entries()

    
    
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize(), my_json=my_json, offset=offset, max_10_results_amount=max_10_results_amount, complete_results_amount= complete_results_amount, sort_expense_order = sort_expense_order, view_mode = view_mode, running_count = running_count)

  


    

       
     
@app.route("/new_sort", methods = ['POST', 'GET'])
def new_sort():

    view_mode = "new-sort"

    global running_count



   
   
    my_list.clear()
    user_id = session.get("user_id")
    
    sort_new_order = request.args.get("sort-by", "desc")
   
   
    offset = request.args.get("offset", 0)
    offset = int(offset)

    username = session.get("username")

    sql_complete_query = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s"
    cursor.execute(sql_complete_query,(user_id,))
    complete_query_results = cursor.fetchall()
    complete_query_results_amount = len(complete_query_results)
    complete_results_amount = int(complete_query_results_amount)
    
    
   
    

    
    sql_select_all = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s ORDER BY expense_date {sort_new_order.upper()} LIMIT 10 OFFSET %s  "
    cursor.execute(sql_select_all, (user_id,offset))
    results = cursor.fetchall()
    max_10_results_amount= len(results)
    max_10_results_amount = int(max_10_results_amount)



    running_count = offset + max_10_results_amount
    



    for column in results:
        expense_id = column[0] # type: ignore
        expense_name = column[1]
        expense_cost = float(column[2])
        expense_date = column[3] # type: ignore
        converted_date = expense_date.strftime("%m-%d-%Y")
        expense_category = column[4] # type: ignore

        my_list.append({"expense_id":expense_id,"expense_name":expense_name,"amount":expense_cost,"expense_date":converted_date,"expense_category":expense_category })


    my_json= json.dumps(my_list)






    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
    entries = get_entries()
    
   
    
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, entries=entries, username=str(username).capitalize(),  sort_new_order=sort_new_order, my_json=my_json, offset = offset, max_10_results_amount = max_10_results_amount, complete_results_amount = complete_results_amount, view_mode = view_mode, running_count = running_count)




@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    entries = get_entries()
    expense = request.form.get("expense_name")
    amount = float(request.form.get("amount", 0))
    date = request.form.get("expense_date")
    expense_category = request.form.get("category", None)
    
    cursor = sql_connect.cursor()
    user_id = session.get("user_id")
    
    username = session.get("username")
    password = session.get("password")
    """sql = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s"
    cursor.execute(sql, (username, password))"""
    
    cursor.execute("INSERT INTO expense_tracker_expense_data (user_id, expense_name, expense_cost, expense_date, expense_category) VALUES (%s, %s, %s, %s, %s)", (user_id, expense, amount, date, expense_category))
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
        saved_id = results[0] # type: ignore
        saved_username = results[1] # type: ignore
        saved_password = results[2] # type: ignore
        
        if username_input == saved_username and password_input == saved_password:
            session["user_id"] = saved_id
            session["username"] = saved_username
            session["password"] =  saved_password
          
            return redirect(url_for('dashboard', offset = 0))

    
    except TypeError:
        error = "Incorrect Username or Password"
        return render_template('login_page.html', error=error )
    return ""
   
   
    












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
    sql_get_user_id = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s"
    cursor.execute(sql_get_user_id, (username, password))
    results = cursor.fetchone()
    session["username"] = username
    session["password"] = password
    my_id = session["user_id"] = results[0] # type: ignore
    
    #cursor.close()
    return redirect(url_for("dashboard"))
   
# ================== 
#  FUNCTION ================== # 


@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return redirect(url_for('home_page'))  # Redirect to login page











if __name__ == "__main__":
    app.run(debug=True)