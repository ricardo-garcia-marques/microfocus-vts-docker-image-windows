::start 4 VTS instances
..\node ..\vtscmd /start /port 4001 /name Customers
..\node ..\vtscmd /start /port 4002 /name Products
..\node ..\vtscmd /start /port 4003 /name Orders
..\node ..\vtscmd /start /port 4004 /name Employees

::remove all data in these 4 instances. Be careful when running delete_all command!
..\node ..\vtscmd /delete_data /port 4001
..\node ..\vtscmd /delete_data /port 4002
..\node ..\vtscmd /delete_data /port 4003
..\node ..\vtscmd /delete_data /port 4004

::import sample csv files into the VTS instances
..\node ..\vtscmd /import Customers.csv /port 4001
..\node ..\vtscmd /import Employees.csv /port 4002
..\node ..\vtscmd /import Orders.csv /port 4003
..\node ..\vtscmd /import Products.csv /port 4004

::Open all the instances admin UI in browser
start http://localhost:4001
start http://localhost:4002
start http://localhost:4003
start http://localhost:4004
