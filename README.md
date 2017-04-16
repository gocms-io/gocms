// TODO - Write optimizer for plugins and themes. 
Optimizer should look at vendor.js and theme_vendor.js - remove any repeates in theme-vendor.js and save to a secondary file

GRNow Backend Services

<h3>Generate Docs</h3>
<p>To generate api docs you need to have apidocs installed</p>
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


