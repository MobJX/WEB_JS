package it.polimit.tiw.asta.dao;


import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import it.polimit.tiw.asta.beans.User;



public class UserDAO {
	private Connection con;

	public UserDAO(Connection connection) {
		this.con = connection;
	}


	public User checkCredentials(String username, String password) throws SQLException {
		String query = "select * from User where username=? and password=?";
		try (PreparedStatement pstatement = con.prepareStatement(query);) {
			pstatement.setString(1, username);
			pstatement.setString(2, password);
			try (ResultSet result = pstatement.executeQuery();) {
				if (!result.isBeforeFirst()) {
					
					return null;// no results, credential check failed
				} 
					
				else {
					result.next();
					User user = new User();
					user.setId(result.getInt("userID"));
					user.setUsername(result.getString("username"));
					user.setAddress(result.getString("address"));
					return user;
				}
			}
		}
	}
}