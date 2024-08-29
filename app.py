from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)


my_list = []

income = float(2660.00)




@app.route('/',  methods=["GET", "POST"])


def home_page():

    my_expenses = expenses_total()

    free_money = calclulate_money_leftover()


   
    return render_template('index.html', income=income, my_list=my_list, my_expenses=my_expenses, free_money=free_money)


@app.route('/submitted_data', methods=["GET", "POST"])
def submit_expense():
    name = request.form.get("name")
    amount = float(request.form.get("amount", 0))
   
    my_list.append({"name":name, "amount":amount})
    
    
    
    
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

@app.route('/delete_expense/<int:index>', methods=['POST','GET'])
def delete_expense(index):
    if 0 <= index < len(my_list):
        my_list.pop(index)
    return redirect(url_for('home_page', index=index))


@app.route('/users/<name>')
def user(name):
	return "<h3>Welcome {}</h3>".format(name)



if __name__ == "__main__":
    app.run(debug=True)