package migrations

import "github.com/rubenv/sql-migrate"

func AddACL() *migrate.Migration {
	addAcl := migrate.Migration{
		Id: "3",
		Up: []string{`
			CREATE TABLE gocms_groups (
			id int(11) NOT NULL AUTO_INCREMENT,
			name varchar(30) NOT NULL UNIQUE,
			description varchar(255) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_users_to_groups (
			userId int(11) NOT NULL,
			groupId int(11) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (userId, groupId),
			FOREIGN KEY (userId)
				REFERENCES gocms_users (id)
				ON DELETE CASCADE,
			FOREIGN KEY (groupId)
				REFERENCES gocms_groups (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			CREATE TABLE gocms_groups_to_permissions (
			groupId int(11) NOT NULL,
			permissionId int(11) NOT NULL,
			created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (groupId, permissionId),
			FOREIGN KEY (groupId)
				REFERENCES gocms_groups (id)
				ON DELETE CASCADE,
			FOREIGN KEY (permissionId)
				REFERENCES gocms_permissions (id)
				ON DELETE CASCADE
			) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
			`, `
			UPDATE gocms_permissions SET name='super_admin', description='Super Admins have full access to everything.' WHERE id=1;
			`, `
			ALTER TABLE gocms_users_to_permissions
			DROP FOREIGN KEY gocms_users_to_permissions_ibfk_2;
			`, `
			ALTER TABLE gocms_users_to_permissions
			CHANGE permissionsId permissionId INT(11) NOT NULL;
			`, `
			ALTER TABLE gocms_users_to_permissions
			ADD CONSTRAINT gocms_users_to_permissions_ibfk_2
			FOREIGN KEY (permissionId)
			REFERENCES gocms_permissions (id)
			ON DELETE CASCADE;
			`, `
			INSERT INTO gocms_settings (name, value, description) VALUES('PERMISSIONS_CACHE_LIFE', '3600', 'Seconds to cache permissions between requests.');
			`,
		},
		Down: []string{
			"DROP TABLE gocms_users_to_groups;",
			"DROP TABLE gocms_groups_to_permissions;",
			"DROP TABLE gocms_groups;",
		},
	}

	return &addAcl
}
