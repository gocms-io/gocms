package migrations

import "github.com/rubenv/sql-migrate"


func CreateInitial() *migrate.Migration{
	create_initial := migrate.Migration{
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
			`,

		},
		Down: []string{
			"DROP TABLE users;",
		},
	}

	return &create_initial
}
