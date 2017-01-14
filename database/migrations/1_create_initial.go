package migrations

import "github.com/rubenv/sql-migrate"

func CreateInitial() *migrate.Migration {
	create_initial := migrate.Migration{
		Id: "1",
		Up: []string{`

			CREATE TABLE gocms_users (
			id int(11) NOT NULL AUTO_INCREMENT,
			fullName varchar(255) NOT NULL,
			password varchar(255) NOT NULL,
			gender int(1) NOT NULL DEFAULT 0,
			minAge int(3) NOT NULL DEFAULT 0,
			maxAge int(3) NOT NULL DEFAULT 0,
			photo varchar(255) NOT NULL DEFAULT '',
			enabled int(1) NOT NULL DEFAULT 0,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_emails (
			id int(11) NOT NULL AUTO_INCREMENT,
			userId int(11) NOT NULL,
			email varchar(255) NOT NULL UNIQUE,
			isVerified int(1) NOT NULL DEFAULT 0,
			isPrimary int(1) NOT NULL DEFAULT 0,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (userId)
				REFERENCES gocms_users (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_permissions (
			id int(11) NOT NULL AUTO_INCREMENT,
			name varchar(30) NOT NULL UNIQUE,
			description varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_secure_codes (
			id int(11) NOT NULL AUTO_INCREMENT,
			userId int(11) NOT NULL,
			type int(2) NOT NULL,
			code varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (userId)
				REFERENCES gocms_users (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_settings (
			id int(11) NOT NULL AUTO_INCREMENT,
			name varchar(30) NOT NULL UNIQUE,
			value varchar(255) NOT NULL,
			description varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_users_to_permissions (
			userId int(11) NOT NULL,
			permissionsId int(11) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (userId, permissionsId),
			FOREIGN KEY (userId)
				REFERENCES gocms_users (id)
				ON DELETE CASCADE,
			FOREIGN KEY (permissionsId)
				REFERENCES gocms_permissions (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			INSERT INTO gocms_users (id, fullname, password, enabled) VALUES(1, 'admin', '$2a$10$D1C8R1pdLp59o8/2e/b7N.2fZ7gUk6Gr8gux1O1JVkQHTPPjMVHCK', 1);
			`, `
			INSERT INTO gocms_emails (id, userId, email, isVerified, isPrimary) VALUES(1, 1, 'admin@gocms.io', 1, 1);
			`, `
			INSERT INTO gocms_permissions (id, name, description) VALUES(1, 'admin', 'Admin Permissions');
			`, `
			INSERT INTO gocms_users_to_permissions (userId, permissionsId) VALUES(1, 1);
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('DEBUG', 'true', 'Debug output to console or log file.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('DEBUG_SECURITY', 'true', 'Sensative content allowed in debug output to console or log files.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('PORT', '9090', 'Port for API to run on.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('PUBLIC_API_URL', 'http://localhost:9090/api', 'Fully qualified url for the publicly acessable API endpoings.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('REDIRECT_ROOT_URL', 'http://localhost:9090/api/healthy', 'Default url to redirect to.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('CORS_HOST', '*', 'Hosts allowed to make CORS requests.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('AUTHENTICATION_KEY', 'this should be really long and random', 'Key used for Token Encryption.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('USER_AUTHENTICATION_TIMEOUT', '43200', 'User token timeout.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('PASSWORD_RESET_TIMEOUT', '10', 'Password reset authentication code timeout.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('DEVICE_AUTHENTICATION_TIMEOUT', '43200', 'Device token timeout for two-factor authentication.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('TWO_FACTOR_CODE_TIMEOUT', '10', 'Two factor code timeout.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('EMAIL_ACTIVATION_TIMEOUT', '10', 'Email activation link timeout.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('USE_TWO_FACTOR', 'false', 'Require two-factor authentication?');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('PASSWORD_COMPLEXITY', '1', 'Complexity requirements for password (0-5).');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('OPEN_REGISTRATION', 'true', 'Allow users to register without an invite.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_SERVER', 'SMTP SERVER HERE', 'SMTP server domain name or ip.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_PORT', '465', 'Port to send smtp mail to.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_USER', 'USER_HERE', 'Username for SMTP authentication.');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_PASSWORD', 'PASSWORD_HERE', 'Password from SMTP authentication');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_FROM_ADDRESS', 'FROM NAME HERE <email@address.com>', 'FROM Name and email address for outgoing email. ');
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('SMTP_SIMULATE', 'true', 'Simulate SMTP email and print to console instead of sending to server.');
			`,

		},
		Down: []string{
			"DROP TABLE gocms_users;",
			"DROP TABLE gocms_emails;",
			"DROP TABLE gocms_secure_codes;",
			"DROP TABLE gocms_permissions;",
			"DROP TABLE gocms_users_to_permissions;",
		},
	}

	return &create_initial
}
