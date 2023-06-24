package it.polimit.tiw.asta.dao;


import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import it.polimit.tiw.asta.beans.Offer;
import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.User;



public class UserDAO {
	private Connection con;
	private static final String SELECT_USER_BY_AUCID ="SELECT* FROM Offer NATURAL JOIN User where aucID = ?";
	private static final String SELECT_USER_BY_OFFERID ="SELECT* FROM Offer NATURAL JOIN User where offerID = ?";
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
	
	//for testing
	//TODO:delete this 
	
	public User findByUserName(String username) throws SQLException {
		String query = "select * from User where username=? ";
		try (PreparedStatement pstatement = con.prepareStatement(query);) {
			pstatement.setString(1, username);
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
	
	/**
	 * find all the offers of specific auction
	 * @param Auction
	 * @return User
	 * @throws SQLException 
	 */
	public User findUserOfAuction(Auction auction) throws SQLException{
		User user = null;
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_USER_BY_AUCID);){
			pstatement.setInt(1, auction.getAucID());
			try(ResultSet result = pstatement.executeQuery();){
				if(result.next()) {
					user = new User();
					user.setId(result.getInt("userID"));
					user.setUsername(result.getString("username"));
					user.setAddress(result.getString("address"));
	
	
				}
			}
		}
		return user;
	}
	
	/**
	 * find all the offers of specific auction
	 * @param Offer
	 * @return User
	 * @throws SQLException 
	 */
	public User findUserOfAuctionByOffer(Offer offer) throws SQLException{
		User user = null;
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_USER_BY_OFFERID);){
			pstatement.setInt(1, offer.getOfferID());
			try(ResultSet result = pstatement.executeQuery();){
				if(result.next()) {
					user = new User();
					user.setId(result.getInt("userID"));
					user.setUsername(result.getString("username"));
					user.setAddress(result.getString("address"));
	
				}
			}
		}
		return user;
	}
	
}