// TODO - Write optimizer for plugins and themes. 
Optimizer should look at vendor.js and theme_vendor.js - remove any repeates in theme-vendor.js and save to a secondary file

GRNow Backend Services

<h1>GoCMS</h1>

<h3>Generate Docs</h3>
<p>To generate api docs you need to have apidocs installed</p>
<em>Note apidocs will only work on MacOS and Linux</em>
<pre>npm install apidoc -g</pre>

<h3>.env</h3>
<p>You will need to have a .env file to do local development with. It goes in the root of the project file. ex:</p>
<pre>
    # DB Local
    DB_NAME=goCMS
    DB_USER=goCMSbp
    DB_PASSWORD=password
    DB_SERVER=tcp(localhost:3306)
</pre>

<h3>Setup Database</h3>

1) Download MySQL Workbench here: 
<pre>https://dev.mysql.com/downloads/workbench/</pre>

2) Create a MySQL connection in Workbench (if you don't have one)
<pre>
    Connection Name: localhost
    Hostname: 127.0.0.1
    Port: 3306
    Username: root
</pre>

3) Create a New Schema (database icon)
<pre>Schema Name: goCMS</pre>

4) Add a New User
<pre>select 'Management Tab' > 'Users and Privliges' > 'Add Account'

    Login Name: goCMSbp
    Limit to Hosts Matching: localhost
    Password: password
    Confirm Password: password

    In the same window, go to 'Schema Privliges Tab' > 'Add Entry...'
    Selected Schema: goCMS

    With the goCMS schema selected, 'SELECT "ALL"' (should select all privliges)
    click 'Apply'
</pre>

<h3>Install & Run govendor</h3>
<pre>
    go get -u github.com/kardianos/govendor
    run govendor sync (in project root)
</pre>