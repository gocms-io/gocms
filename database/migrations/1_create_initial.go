package migrations

import "github.com/rubenv/sql-migrate"


func CreateInitial() *migrate.Migration{
	create_initial := migrate.Migration{
		Id: "1",
		Up: []string{`

			CREATE TABLE gocms_users (
			id int(11) NOT NULL AUTO_INCREMENT,
			fullName varchar(255) NOT NULL,
			email varchar(255) NOT NULL UNIQUE,
			password varchar(255) NOT NULL,
			gender int(1) NOT NULL DEFAULT 0,
			minAge int(3) NOT NULL DEFAULT 0,
			maxAge int(3) NOT NULL DEFAULT 0,
			photo varchar(255) NOT NULL DEFAULT '',
			enabled int(1) NOT NULL DEFAULT 0,
			verified int(1) NOT NULL DEFAULT 0,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`,`
			CREATE TABLE gocms_emails (
			id int(11) NOT NULL AUTO_INCREMENT,
			userId int(11) NOT NULL,
			email varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (userId)
				REFERENCES gocms_users (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`,`
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
			`,`
			CREATE TABLE gocms_permissions (
			id int(11) NOT NULL AUTO_INCREMENT,
			name varchar(30) NOT NULL UNIQUE,
			description varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`,`
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
			`,`
			INSERT INTO gocms_users (id, fullname, email, password, enabled, verified) VALUES(1, 'admin', 'admin@gocms.io', '$2a$10$D1C8R1pdLp59o8/2e/b7N.2fZ7gUk6Gr8gux1O1JVkQHTPPjMVHCK', 1, 1);
			`,`
			INSERT INTO gocms_permissions (id, name, description) VALUES(1, 'admin', 'Admin Permissions');
			`,`
			INSERT INTO gocms_users_to_permissions (userId, permissionsId) VALUES(1, 1);
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
