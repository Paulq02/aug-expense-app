from flask import Flask, render_template, url_for, request, redirect, session, jsonify
from datetime import datetime
import mysql.connector
import os
from dotenv import load_dotenv


import json, time


load_dotenv()





app = Flask(__name__)

db = mysql.connector.connect(user="root", 
password=os.environ.get("DB_PASSWORD"), 
host="localhost", 
database="expense_data")




app.secret_key = "padthai123Z$meme"
cursor = db.cursor()


"""
my_list notes:

- my_list is a Python list that stores key/value pairs fetched from the MySQL database.
- Each time the query runs, the resulting key/value data is appended to this list.
- This allows easy access and iteration over the database records later in the code.

"""


my_list = []

complete_list = []



#amounts_list = []







income = float(0)






running_count = 0

def get_db():
    db = mysql.connector.connect(user="root", 
    password= os.environ.get("DB_PASSWORD"),
    host="localhost", 
    database="expense_data")
    return db






@app.route('/',  methods=["GET", "POST"])



def login_page():
    """
login_page notes:

- This function serves as the main login page.
- When the program starts, the user can either log in or create a new account.
- It is also called when the user logs out, returning them to the login page.
- When logout occurs, my_list is cleared of all key/value pairs to reset the session data.
"""

    my_list.clear()
    
    return render_template('login_page.html')
   



@app.route("/dashboard", methods = ['GET', 'POST', 'DELETE'])
def dashboard():
    db = get_db()
    cursor = db.cursor()
   
   
    
    
    """
dashboard notes:
- The "view_mode" value is sent to the Jinja index template to tell it which forms and buttons to show when a specific function runs.

- Called after a user logs in; serves as the default page.
- Uses the global variable running_count to keep track of pagination.
- Clears my_list so each query starts fresh (removes any previous results).
- Gets the user's unique user_id and username from the session data.
- Checks whether the expense rows should be sorted ascending or descending.
- Retrieves user_year_selection (defaults to "all") to show all expenses
  regardless of year.

SQL queries:
    1. complete_results_amount - number of all expense entries for this user
       (shown in the "Entries" section).
    2. total_sum_cost - total of all expense costs for this user
       (shown in the "Expenses" section).
    3. max_10_results_amount - fetches up to 10 expenses at a time
       for easier viewing (pagination).

- running_count tracks which batch of expenses the user is viewing.
- If no rows are found in max_10_results_amount, the user is redirected
  to the first_login template prompting them to start adding expenses.
- If data is found:
    • Converts expense_cost to float.
    • Converts expense_date to mm/dd/yyyy format.
    • Appends expense_id, expense_name, expense_cost, expense_date,
      and expense_category as key/value pairs to my_list.
- Converts my_list to JSON and calls render_template("index.html")
  passing all required values to display the dashboard.
"""


    global running_count
    view_mode = "dashboard"
   
   
  
    

    my_list.clear()

    get_current_year = datetime.now()
   

    converted_year = str(get_current_year)
    showing_year = converted_year[0:4]
    
   

    previous_year = int(showing_year)-1
   

    current_month = converted_year[5:7]

   
    
   
    
    showing_month = get_current_year.strftime('%B')
    

   

   
    user_id = session.get("user_id")
    username = session.get("username")
    

    asc_or_desc = request.args.get("sortOrder", "desc")
    
    offset = int(request.args.get("offset", 0))
    
   
    user_year_selection = request.args.get("year", "none")


    selected_month = request.args.get("selected-month", None)
    #print(f"this is selected month  begining of function ---------------{selected_month}")

    selected_year = request.args.get("selected-year", None)
    #print(f"this is selected year begining of function ---------------{selected_year}")
    
    try:

        if selected_year is None and selected_month is None:
            
            sql_select_max_category = f"SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s GROUP BY expense_category order by top_category desc LIMIT 1"
            cursor.execute(sql_select_max_category,(user_id,showing_year,current_month))
            top_category_results = cursor.fetchall()
            
            top_cat_result_amount = len(top_category_results)

            print("this is line 182")
        
            if top_cat_result_amount == 0:
                
                years_list = ["2025", "2026"]

                month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}
                month_list_reversed = dict(reversed(list(month_list.items())))
                string_month = "your mom"
                for key, value in month_list_reversed.items():
                    if key == current_month:
                        string_month = value
                
                return render_template('first_login.html', username=str(username).capitalize(), years_list = years_list,  month_list_reversed =  month_list_reversed, showing_year = showing_year, current_month = current_month, string_month = string_month)
        
        
        
       
        if selected_year and selected_month != None:

        
        
        
            selected_month = request.args.get("selected-month", None)
            
    

            selected_year = request.args.get("selected-year", None)
            
    
        
            showing_year = selected_year
            current_month = selected_month


        


        sql_complete_results = f"SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date)= {showing_year} AND MONTH(expense_date) = {current_month}"
        cursor.execute(sql_complete_results,(user_id,))
        complete_results = cursor.fetchall()
        complete_results_amount = len(complete_results)
        complete_results_amount = int(complete_results_amount)

        if complete_results_amount == 0 :
            years_list = ["2025", "2026"]

            month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}
            month_list_reversed = dict(reversed(list(month_list.items())))
            
            for key, value in month_list_reversed.items():
                if key == current_month:
                    string_month = value
                
                    return render_template('first_login.html', username=str(username).capitalize(), years_list = years_list,  month_list_reversed =  month_list_reversed, showing_year = showing_year, current_month = current_month, string_month = string_month)
            
        

       
   
        sql_select_max_category = f"SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s GROUP BY expense_category order by top_category desc LIMIT 1"
        cursor.execute(sql_select_max_category,(user_id,showing_year,current_month))
        top_category_results = cursor.fetchall()
        
        for item in top_category_results:
            top_category_name =item[0].title() # type: ignore
            top_category_amount = item[1] # type: ignore # type: ignore"""
    
    
    
    
        sql_bar_doughnut_chart_data= f"SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s GROUP BY expense_category"
        cursor.execute(sql_bar_doughnut_chart_data,(user_id,showing_year,current_month))
        
        bar_doughnut_chart_results = cursor.fetchall()
            
        bar_doughnut_chart_list = []

        for item in bar_doughnut_chart_results:
            name = item[0]
            amount = float(item[1])
            bar_doughnut_chart_name_dictionary = {"name":name, "amount":amount}
            bar_doughnut_chart_list.append(bar_doughnut_chart_name_dictionary)

        

        
        sql_sum_total_query = f"SELECT SUM(expense_cost) FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = {showing_year} AND MONTH(expense_date) = {current_month}"
        cursor.execute(sql_sum_total_query,(user_id,))
        sql_sum_total_results = cursor.fetchone()
        total_sum_cost = sql_sum_total_results[0] # type: ignore
    
        
    
    
        
        sql_max_10_query = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date)= %s AND MONTH(expense_date) = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s "
        cursor.execute(sql_max_10_query, (user_id,showing_year, current_month, offset))
        max_10_results = cursor.fetchall()
        max_10_results_amount = len(max_10_results)
        max_10_results_amount = int(max_10_results_amount)
            
            
            
        running_count = offset + max_10_results_amount

        years_list = ["2025", "2026"]

        month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}

        month_list_reversed = dict(reversed(list(month_list.items())))

        
    
        if not max_10_results:
            
            for month in month_list_reversed.items():
                
            
                if month[0] == selected_month:
                    string_month = month[1]
                
            
                
                
                    return render_template('first_login.html', username=str(username).capitalize(), years_list = years_list,  month_list_reversed =  month_list_reversed, showing_year = showing_year, current_month = current_month, string_month = string_month)
        
        for data in max_10_results:
            expense_id_row = data[0] # type: ignore
            expense_row = data[1] # type: ignore
            amount_row = float(data[2]) # type: ignore
                
            date_from_db = data[3] # type: ignore

            expense_category_row = data[4] # type: ignore
                
            formatted_date = datetime.strftime(date_from_db, "%m-%d-%Y" ) # type: ignore
                
                
                
            my_list.append({"expense_id":expense_id_row, "expense_name":expense_row.title(), "amount":amount_row, "expense_date":formatted_date,  "expense_category":expense_category_row})
            
    
        
            my_json= json.dumps(my_list)

            chart_bar_doughnut_data = json.dumps(bar_doughnut_chart_list)

            

            
            my_expenses = expenses_total()

            free_money = calclulate_money_leftover()

            years_list = ["2025", "2026"]

            month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}

            month_list_reversed = dict(reversed(list(month_list.items())))

            
   


        
        
        return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, username=str(username).capitalize(), user_year_selection=user_year_selection, my_json=my_json, offset=offset, max_10_results_amount=max_10_results_amount, complete_results_amount= complete_results_amount, asc_or_desc = asc_or_desc, view_mode = view_mode, running_count = running_count, total_sum_cost = total_sum_cost, time = time, showing_month = showing_month, showing_year = showing_year, top_category_name = top_category_name, top_category_amount = top_category_amount, chart_bar_doughnut_data = chart_bar_doughnut_data, previous_year = previous_year,  current_month = current_month, years_list = years_list,  month_list_reversed =  month_list_reversed)

    finally:
        cursor.close()
        db.close()



   


@app.route("/user_search", methods = ["GET"]) 
def user_search():
    db = get_db()
    cursor = db.cursor(dictionary=True)
  

    


    user_id = session.get("user_id")
    user_input = request.args.get("userSearch", "")
   

    
    
    

    offset = int(request.args.get("offset", None)) # type: ignore
 
    

    

    

   
    
   
  
    

    
    sql_search_expense_name = ("SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND expense_name LIKE %s LIMIT 10 OFFSET %s")
    cursor.execute(sql_search_expense_name,(user_id, user_input + "%", offset))
    results = cursor.fetchall()

    amount_results = len(results)

    running_count = offset + amount_results


    

    

    sql_user_search_total_amount_query = f"SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND expense_name LIKE %s"
    cursor.execute(sql_user_search_total_amount_query, (user_id,user_input + "%" ))
    sql_user_search_total_amount_results = cursor.fetchall()
    sql_user_search_total_amount = len(sql_user_search_total_amount_results)

   

   
    
   
    
    

   
    
    user_search_list = []
    
    for data in results:
       
        expense_id = data["expense_id"] # type: ignore
        expense_name = data["expense_name"].title() # type: ignore
        expense_cost = data["expense_cost"] # type: ignore
        expense_date = data["expense_date"] # type: ignore

        converted_date = expense_date.strftime("%m-%d-%Y")
       
        data_dict = {"expense_id":expense_id, "expense_name":expense_name,"expense_cost":f"${expense_cost}", "expense_date":converted_date, "total_results":sql_user_search_total_amount, "running_count": running_count, "user_id":user_id}

        
        user_search_list.append(data_dict)



   
    if not results:
        no_results = {"message": "no results"}
        cursor.close()
        db.close()
        return jsonify(no_results)
       
    else:
        cursor.close()
        db.close()
        return jsonify(user_search_list)
   



@app.route('/sort_by_year', methods=["POST", "GET"])
def sort_year():
    get_current_year = datetime.now()
    converted_year = str(get_current_year)
    selected_year = converted_year[0:4]

   
    global running_count
    
   
    view_mode = "sort-year"

    my_list.clear()
    username = session.get("username")
    user_id = session.get("user_id")
    
    
    asc_or_desc = request.args.get("sortOrder","desc")
   
    
    user_year_selection = request.args.get("year","none")
    

    offset = request.args.get("offset", 0)

    offset = int(offset)
    
    
    
   
        
    if user_year_selection == "this year":
        get_current_year = datetime.now()
        converted_year = str(get_current_year)
        selected_year = converted_year[0:4]
        


        sql_year_expenses = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s"
        cursor.execute(sql_year_expenses,(user_id,selected_year,offset))
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
        cursor.execute(sql_complete_results,(user_id,selected_year))
        fetched_results = cursor.fetchall()
        complete_results_amount = len(fetched_results)



        sql_sum_total_year_query = "SELECT SUM(expense_cost) FROM expense_tracker_expense_data WHERE user_id = %s and YEAR(expense_date) = %s"
        cursor.execute(sql_sum_total_year_query,(user_id, selected_year))
        sql_sum_total_results = cursor.fetchone()
        total_sum_cost = sql_sum_total_results[0] # type: ignore
    
    
    elif user_year_selection == "last year":
        get_current_year = datetime.now()
        converted_year_to_string = str(get_current_year)
        string_year = converted_year_to_string[0:4]
        selected_year = int(string_year) - 1
        

        


        sql_year_expenses = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s ORDER BY expense_date {asc_or_desc.upper()} LIMIT 10 OFFSET %s"
        cursor.execute(sql_year_expenses,(user_id,selected_year,offset))
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
        cursor.execute(sql_complete_results,(user_id,selected_year))
        fetched_results = cursor.fetchall()
        complete_results_amount = len(fetched_results)



        sql_sum_total_year_query = "SELECT SUM(expense_cost) FROM expense_tracker_expense_data WHERE user_id = %s and YEAR(expense_date) = %s"
        cursor.execute(sql_sum_total_year_query,(user_id, selected_year))
        sql_sum_total_results = cursor.fetchone()
        total_sum_cost = sql_sum_total_results[0] # type: ignore
        


        
    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
            
    my_json= json.dumps(my_list)
    
        
   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, username=str(username).capitalize(),  user_year_selection=user_year_selection, asc_or_desc = asc_or_desc, my_json=my_json, offset = offset, max_10_results_amount = max_10_results_amount, view_mode = view_mode, complete_results_amount = complete_results_amount, running_count = running_count, total_sum_cost = total_sum_cost, time = time)

      
  

    

@app.route("/sort_cost", methods=["GET", "POST"])
def sort_by_cost():
    global running_count

    get_current_date = datetime.now()
    converted_date = str(get_current_date)
    current_year = converted_date[0:4]
    current_month = converted_date[5:7]
    converted_month = get_current_date.strftime("%B")
    
   
    
    my_list.clear()

    view_mode = "sort-cost"

   
    username = session.get("username").capitalize()
    
    offset = request.args.get("offset", 0)
    offset = int(offset)
   
    
    
    
    user_id = session.get("user_id")
    sort_expense_order = request.args.get("sort-expense", None)


    selected_year = request.args.get("selected-year", None)
    selected_month = request.args.get("selected-month", None)

    print(f"{selected_year}")
    print(f"{selected_month}")

    if selected_year and selected_month != None:
        current_year = selected_year
        current_month = selected_month

    sql_select_all = f"SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s"
    cursor.execute(sql_select_all,(user_id,current_year,current_month))
    sql_all_results = cursor.fetchall()
    complete_results_amount = len(sql_all_results)
    complete_results_amount = int(complete_results_amount)


    sql_top_category_query = f"SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s GROUP BY expense_category ORDER BY top_category DESC LIMIT 1"
    cursor.execute(sql_top_category_query,(user_id, current_year, current_month))
    
    sql_top_category_results = cursor.fetchone()

    top_category_name = sql_top_category_results[0].title() # type: ignore
    top_category_amount = sql_top_category_results[1] # type: ignore

    


    sql_total_sum_query = f"SELECT SUM(expense_cost) as total_sum FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s"
    cursor.execute(sql_total_sum_query,(user_id,current_year,current_month))
    sql_total_sum_results = cursor.fetchall()
    

    
    for sum in sql_total_sum_results:
        total_sum = sum[0]
   





    sql_bar_doughnut_chart_data= f"SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s GROUP BY expense_category"
    cursor.execute(sql_bar_doughnut_chart_data,(user_id,current_year,current_month))
   
    bar_doughnut_chart_results = cursor.fetchall()
    
    bar_doughnut_chart_list = []

    for item in bar_doughnut_chart_results:
        name = item[0]
        amount = float(item[1])
        bar_doughnut_chart_name_dictionary = {"name":name, "amount":amount}
        bar_doughnut_chart_list.append(bar_doughnut_chart_name_dictionary)
   


    
    

    sql_sort_cost = f"SELECT expense_id,expense_name,expense_cost,expense_date,expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s and MONTH(expense_date) = %s order by expense_cost {sort_expense_order} LIMIT 10 OFFSET %s "
    cursor.execute(sql_sort_cost, (user_id,current_year,current_month,offset))
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

    chart_bar_doughnut_data = json.dumps(bar_doughnut_chart_list)

   

      
    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
    month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}
   
    month_list_reversed = dict(reversed(list(month_list.items())))
    
    years_list = ["2025", "2026"]
    
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, username=str(username).capitalize(), my_json=my_json, offset=offset, max_10_results_amount=max_10_results_amount, complete_results_amount= complete_results_amount, sort_expense_order = sort_expense_order, view_mode = view_mode, running_count = running_count, time = time,   chart_bar_doughnut_data =  chart_bar_doughnut_data, showing_year = current_year, showing_month = converted_month, total_sum_cost = total_sum, top_category_name = top_category_name, top_category_amount = top_category_amount, month_list_reversed = month_list_reversed, years_list = years_list, current_month = current_month)

  


    

       
     
@app.route("/new_sort", methods = ['POST', 'GET'])
def new_sort():

    current_date = datetime.now()
    
    current_year = str(current_date)[0:4]
    current_month = str(current_date)[5:7]

    converted_month = current_date.strftime("%B")
   

    view_mode = "new-sort"

    global running_count



   
   
    my_list.clear()
    user_id = session.get("user_id")
    
    sort_new_order = request.args.get("sort-by", "desc")
   
   
    offset = request.args.get("offset", 0)
    offset = int(offset)

    username = session.get("username")

    selected_year = request.args.get("selected-year", None)
    selected_month = request.args.get("selected-month", None)

    if selected_year and selected_month != None:
        current_year = selected_year
        current_month = selected_month
    
    print(f"THIS IS YOUR CURRENT MONTH NEW SORT{current_month}")
    print(f"THIS IS YOUR CURRENT YEAR NEW SORT{current_year}")



    sql_complete_query = "SELECT * FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s AND MONTH(expense_date) = %s"
    cursor.execute(sql_complete_query,(user_id,current_year, current_month))
    complete_query_results = cursor.fetchall()
    complete_query_results_amount = len(complete_query_results)
    complete_results_amount = int(complete_query_results_amount)
    

    sql_total_sum_query = """SELECT SUM(expense_cost) as total_sum FROM expense_tracker_expense_data 
    WHERE user_id = %s AND YEAR(expense_date) = %s AND MONTH(expense_date) = %s
    """
    cursor.execute(sql_total_sum_query,(user_id, current_year, current_month))
    sql_total_sum_results = cursor.fetchone()
    
    total_sum_cost = sql_total_sum_results[0] # type: ignore

    sql_top_category_query = "SELECT expense_category, SUM(expense_cost) as top_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s AND MONTH(expense_date) =  %s GROUP BY expense_category ORDER BY top_category DESC LIMIT 1"
    cursor.execute(sql_top_category_query, (user_id, current_year, current_month))
    sql_top_category_results = cursor.fetchone()

    print(f"THIS IS YOUR SQL TOP CAT RESULTS NEW SORT ---{sql_top_category_results}")

    top_category_name = sql_top_category_results[0].title() # type: ignore
    top_category_amount = sql_top_category_results[1] # type: ignore
    

    
    sql_max_10_query = f"SELECT expense_id, expense_name, expense_cost, expense_date, expense_category FROM expense_tracker_expense_data WHERE user_id = %s AND YEAR(expense_date) = %s AND MONTH(expense_date) = %s ORDER BY expense_date {sort_new_order.upper()} LIMIT 10 OFFSET %s"
    cursor.execute(sql_max_10_query, (user_id,current_year, current_month, offset))
    max_10_results = cursor.fetchall()
    max_10_results_amount= len(max_10_results)
    max_10_results_amount = int(max_10_results_amount)


    sql_sum_all_category_query = """SELECT expense_category, SUM(expense_cost) AS total_per_category 
    FROM expense_tracker_expense_data 
    WHERE user_id = %s AND YEAR(expense_date) = %s AND MONTH(expense_date) = %s 
    GROUP BY expense_category
    """
    cursor.execute(sql_sum_all_category_query, (user_id,current_year, current_month))
    sql_sum_all_category_results = cursor.fetchall()
    
    category_sum_list = []

    for item in sql_sum_all_category_results:
       
        category = item[0] # type: ignore
        total = float(item[1]) # type: ignore
        category_sum_dictionary = {"name":category, "amount": total}
        category_sum_list.append(category_sum_dictionary)
        
        
    
       

        

   



    running_count = offset + max_10_results_amount
    



    for column in max_10_results:
        expense_id = column[0] # type: ignore
        expense_name = column[1]
        expense_cost = float(column[2])
        expense_date = column[3] # type: ignore
        converted_date = expense_date.strftime("%m-%d-%Y")
        expense_category = column[4] # type: ignore

        my_list.append({"expense_id":expense_id,"expense_name":expense_name,"amount":expense_cost,"expense_date":converted_date,"expense_category":expense_category })


    my_json= json.dumps(my_list)
    chart_bar_doughnut_data = json.dumps(category_sum_list)







    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()
   
    month_list = {"01":"Jan", "02":"Feb", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"Aug", "09":"Sept", "10":"Oct", "11":"Nov", "12":"Dec"}
   
    month_list_reversed = dict(reversed(list(month_list.items())))

    
   

    years_list = ["2025", "2026"]

    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money, username=str(username).capitalize(),  sort_new_order=sort_new_order, my_json=my_json, offset = offset, max_10_results_amount = max_10_results_amount, complete_results_amount = complete_results_amount, view_mode = view_mode, running_count = running_count,  time = time, total_sum_cost = total_sum_cost, top_category_name = top_category_name, top_category_amount = top_category_amount, showing_year = current_year, showing_month = converted_month, chart_bar_doughnut_data = chart_bar_doughnut_data, month_list_reversed = month_list_reversed, years_list = years_list, current_year = current_year, current_month = current_month)




@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    db = get_db()
    cursor = db.cursor()
   
    expense = request.form.get("expense_name")
    
    amount = float(request.form.get("amount", 0))
    date = request.form.get("expense_date")
    expense_category = request.form.get("category", None)
    
    
    user_id = session.get("user_id")
    
    username = session.get("username")
    
   
    cursor.execute("INSERT INTO expense_tracker_expense_data (user_id, expense_name, expense_cost, expense_date, expense_category) VALUES (%s, %s, %s, %s, %s)", (user_id, expense, amount, date, expense_category))
    db.commit()
   
    cursor.close()
    db.close()
    return redirect(url_for('dashboard', username=username))


@app.route('/add_expense/', methods=["GET", "POST"])

def add_expense():
    get_current_year = datetime.now()
   

    converted_year = str(get_current_year)
    showing_year = converted_year[0:4]
    current_year_int_convert = int(showing_year)
    previous_year = current_year_int_convert - 1
    print(f"this is your previous year noooobbbb{previous_year}")
    #amounts_list.clear()
    username = session.get("username")
    return render_template('add_expense.html', username=username, time = time, current_year_int_convert = current_year_int_convert, previous_year = previous_year)



def expenses_total():
    total_expenses = 0
    for expense in my_list:
        amount = expense["amount"]
        total_expenses += amount
    return total_expenses

def calclulate_money_leftover():
    money_leftover = income - expenses_total()
    return float(money_leftover)








@app.route("/quick_search_delete", methods = ['GET', 'DELETE'])
def quick_search_delete_expense():
   
    
    try:
        db = get_db()
        cursor = db.cursor()

        user_id = request.args.get("userId", None)
        print(user_id)

        expense_id = request.args.get("expenseId", None)
    
        sql_quick_search_delete = "DELETE FROM expense_tracker_expense_data WHERE user_id = %s AND expense_id = %s"
        cursor.execute(sql_quick_search_delete,(user_id, expense_id))
        db.commit()


        return jsonify({"success":True})
    finally:
        cursor.close()
        db.close()

























@app.route('/delete_expense/<int:expense_id>', methods = ['POST', 'GET'])
def delete_expense(expense_id):
    user_id = session.get("user_id")
    cursor = db.cursor()
    sql = "DELETE FROM expense_tracker_expense_data WHERE expense_id = %s AND user_id = %s "
    cursor.execute(sql, (expense_id,user_id))
    db.commit()
    return redirect(url_for('dashboard'))

@app.route('/users/<name>')
def user(name):
	return "<h3>Welcome {}</h3>".format(name)


@app.route('/update_name/<int:index>/<int:expense_id>', methods=["GET", "POST"])
def update_name(index, expense_id):
    """sumary_line
    
    Keyword arguments:
    argument -- description
    Return: return_description
    """
    
    user_id = session.get("user_id")
    new_name = request.form.get(f"new-name-input-{index}")
    sql_update_name = "UPDATE expense_tracker_expense_data SET expense_name  = %s WHERE expense_id = %s AND user_id = %s "
    cursor.execute(sql_update_name, (new_name,expense_id, user_id ))
    db.commit()
    return redirect(url_for('dashboard'))




@app.route("/update_cost/<int:index>/<int:expense_id>", methods=["GET", "POST"])
def update_cost(index, expense_id):
    user_id = session.get("user_id")
    new_amount = request.form[f"new-cost-input-{index}"]
    sql_update_cost = "UPDATE expense_tracker_expense_data SET expense_cost = %s WHERE expense_id = %s AND user_id = %s"
    cursor.execute(sql_update_cost, (new_amount,expense_id,user_id ))

    db.commit()

    return redirect(url_for('dashboard'))




@app.route("/update_date/<int:index>/<int:expense_id>", methods=["GET", "POST"])
def update_date(index, expense_id):
    user_id = session.get("user_id")
    new_date = request.form[f"new-date-input-{index}"]
    sql_date = "UPDATE expense_tracker_expense_data SET expense_date = %s WHERE expense_id = %s AND user_id = %s"
    cursor.execute(sql_date, (new_date,expense_id, user_id ))
    db.commit()
    return redirect(url_for('dashboard'))




   




@app.route("/signup", methods=["GET", "POST"])
def signup_page():
    
    return render_template("signup.html", time = time)





# LOGIN FUNCTION


@app.route('/login', methods=["GET", "POST"])
def login():

    """ 
    Process a login request.

    - Reads username and password from the submitted form.
    - Lowercases and trims the username; trims the password.
    - Queries the database for a matching username and password.
    - If credentials match:
        • stores the user’s id, username, and password in the session
        • redirects to the dashboard page (offset = 0)
    - If credentials don’t match:
        • catches TypeError from cursor.fetchone()
        • returns the login page with an “Incorrect Username or Password” message.
    
    """
    
  

    
   
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
          
            

    
    except TypeError:
        error = "Incorrect Username or Password"
        return render_template('login_page.html', error=error, time = time  )
    
    return redirect(url_for('dashboard', offset = 0))
   
    












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
    db.commit()
    sql_get_user_id = "SELECT id FROM expense_tracker_users WHERE username = %s AND password = %s"
    cursor.execute(sql_get_user_id, (username, password))
    results = cursor.fetchone()
    session["username"] = username
    session["password"] = password
    my_id = session["user_id"] = results[0] # type: ignore
    
   
    return redirect(url_for("dashboard"))
   
# ================== 
#  FUNCTION ================== # 


@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return redirect(url_for('login_page'))  # Redirect to login page











if __name__ == "__main__":
    app.run(debug=True)



