GRNow Backend Services

<h3>Generate Docs</h3>
<p>To generate api docs you need to have apidocs installed</p>
<pre>npm install apidoc -g</pre>

<h3>.env</h3>
<p>You will need to have a .env file to do local development with. It goes in the root of the project file. ex:</p>
<pre>
    # Debug
    DEBUG=true
    GIN_MODE=debug

    # App config
    PORT=9090
    CORS_HOST=http://localhost:8080
    WWW_ADDRESS="http://localhost:8080"

    # Authentication
    AUTHENTICATION_KEY="this should be really long and random"
    USER_AUTHENTICATION_TIMEOUT=60
    DEVICE_AUTHENTICATION_TIMEOUT=60
    TWO_FACTOR_TIMEOUT=5
    PASSWORD_RESET_TIMEOUT=10

    # DB Local
    DB_NAME=goCMS-boilerPlate
    DB_USER=goCMSbp
    DB_PASSWORD=password
    DB_SERVER=tcp(localhost:3306)

    # smtp
    SMTP_SERVER="mailtrap.io"
    SMTP_PORT=465
    SMTP_USER=448358eeedbbc3
    SMTP_PASSWORD="f01d23ff473a10"
    SMTP_FROM_ADDRESS="goCMS Boiler Plate <goCMS-BloilerPlate@menklab.com>"
    SMTP_SIMULATE=true
</pre>


