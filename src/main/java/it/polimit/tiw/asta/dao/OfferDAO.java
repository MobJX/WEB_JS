package it.polimit.tiw.asta.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Offer;



public class OfferDAO {
	private Connection con;
	
	
	public OfferDAO(Connection connection) {
		this.con=connection;
		
	}
	
	private static final String SELECT_OFFER_BY_ID = "SELECT * FROM Offer WHERE offerID=? ";
	private static final String INSERT_OFFER_SQL = "INSERT INTO Offer(userID,aucID,offerPrice,offerDayTime)"
													+ "VALUES(?,?,?,?)"; //去掉了offerID
	private static final String SELECT_OFFER_BY_AUCID ="select* from Offer where aucID = ? ORDER BY offerDayTime DESC";
	
	public Offer findOffer(int i) throws SQLException {
		
		Offer offer=null;
		
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_OFFER_BY_ID);){
			//setting parameter of query with this.id
			pstatement.setInt(1, i);
			//execute the query
			try(ResultSet result = pstatement.executeQuery();){
				//if there is one row matches create new object OFFER and copying all the info from dataBase
				if(result.next()) {
					offer = new Offer();
					offer.setOfferID(result.getInt("offerID"));
					offer.setUserID(result.getInt("userID"));
					offer.setAucID(result.getInt("aucID"));
					offer.setOfferPrice(result.getFloat("offerPrice"));
					offer.setOfferDayTime(result.getDate("offerDateTime"));
				}
			}
		}
		
		return offer;
		
	}
	
	
	public void createOffer(Offer offer ) throws SQLException { 
		
		try(PreparedStatement pstatement = con.prepareStatement(INSERT_OFFER_SQL);){
				pstatement.setInt(1, offer.getUserID());
				pstatement.setInt(2, offer.getAucID());
		        pstatement.setFloat(3, offer.getOfferPrice());
		        Date currentTime = new Date();
		        Timestamp currentTimestamp = new Timestamp(currentTime.getTime());
		        pstatement.setTimestamp(4, currentTimestamp);
		     
		        
		        pstatement.executeUpdate();
		}
		
		
	}
	
	
	
	/**
	 * find all the offers of specific auction
	 * @param Auction
	 * @return List<Offer>
	 * @throws SQLException 
	 */
	public List<Offer> findAllOfferOfAuction(Auction auction) throws SQLException{
		List<Offer> offers = new ArrayList<Offer>();
		
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_OFFER_BY_AUCID);){
			pstatement.setInt(1, auction.getAucID());
			try(ResultSet result = pstatement.executeQuery();){
				while(result.next()) {
					Offer offer = new Offer();
					offer.setOfferID(result.getInt("offerID"));
					offer.setUserID(result.getInt("userID"));
					offer.setAucID(result.getInt("aucID"));
					offer.setOfferPrice(result.getFloat("offerPrice"));
					offer.setOfferDayTime(result.getTimestamp("offerDayTime"));
					//adding offer to list
					offers.add(offer);
					
				}
			}
		}
		
		return offers;
	}
	
	public List<Offer> findAllOfferOfAuctionByAucId(int auctionID) throws SQLException{
		List<Offer> offers = new ArrayList<Offer>();
		
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_OFFER_BY_AUCID);){
			pstatement.setInt(1, auctionID);
			try(ResultSet result = pstatement.executeQuery();){
				while(result.next()) {
					Offer offer = new Offer();
					offer.setOfferID(result.getInt("offerID"));
					offer.setUserID(result.getInt("userID"));
					offer.setAucID(result.getInt("aucID"));
					offer.setOfferPrice(result.getFloat("offerPrice"));
					offer.setOfferDayTime(result.getTimestamp("offerDayTime"));
					
					//adding offer to list
					offers.add(offer);
					
				}
			}
		}
		
		return offers;
	}

}