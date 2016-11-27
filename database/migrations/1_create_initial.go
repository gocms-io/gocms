package migrations

import "github.com/rubenv/sql-migrate"

var create_initial *migrate.Migration

func init() {
	create_initial = &migrate.Migration{
		Id: "1",
		Up: []string{`

			CREATE TABLE users (
			id int(11) NOT NULL AUTO_INCREMENT,
			fullName varchar(255) NOT NULL,
			email varchar(255) NOT NULL UNIQUE,
			email2 varchar(255),
			password varchar(255) NOT NULL,
			gender int(2),
			minAge int(3),
			maxAge int(3),
			photo varchar(255),
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`,`
			CREATE TABLE secure_codes (
			id int(11) NOT NULL AUTO_INCREMENT,
			userId int(11) NOT NULL,
			type int(2) NOT NULL,
			code varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (userId)
				REFERENCES users (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`,`
			INSERT INTO users (fullName, email, email2, password)
			VALUES ('Test User', 'test@grnow.com', '', '$2a$10$D1C8R1pdLp59o8/2e/b7N.2fZ7gUk6Gr8gux1O1JVkQHTPPjMVHCK');
			`,

		},
		Down: []string{
			"DROP TABLE users;",
		},
	}
}
