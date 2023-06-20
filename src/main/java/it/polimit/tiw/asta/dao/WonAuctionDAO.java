package it.polimit.tiw.asta.dao;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.beans.WonAuction;
import it.polimit.tiw.asta.utils.*;

public class WonAuctionDAO {
    private Connection connection;
    
    private static final String SELECT_USER_BY_AUCTION = "SELECT * FROM offer "
    		+ "WHERE offerPrice = (SELECT MAX(offerPrice) FROM offer);";
    
    public WonAuctionDAO(Connection connection) {
        this.connection = connection;
    }

    public List<WonAuction> findAllAuctionsWonByUser(int userID) throws SQLException {
        List<WonAuction> wonAuctions = new ArrayList<>();
        String query = "SELECT a.*, o.offerPrice "
        		+ "FROM Auction a "
        		+ "JOIN Offer o ON a.aucID = o.aucID "
        		+ "WHERE a.isClosed = 1 AND o.userID = ? "
        		+ "AND o.offerPrice = ( "
        		+ " SELECT MAX(offerPrice) "
        		+ " FROM Offer "
        		+ " WHERE aucID = a.aucID"
        		+ ")";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setInt(1, userID);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    WonAuction wonAuction = new WonAuction();
                    wonAuction.setAucID(resultSet.getInt("aucID"));
                    wonAuction.setOwnerID(resultSet.getInt("ownerID"));
                    wonAuction.setAucPrice(resultSet.getFloat("aucPrice"));
                    wonAuction.setMinUP(resultSet.getFloat("minUP"));
                    wonAuction.setExpiryDateTime(resultSet.getTimestamp("expiryDateTime"));
                    wonAuction.setClosed(resultSet.getBoolean("isClosed"));
                    wonAuction.setWinningBid(resultSet.getFloat("offerPrice"));
                    wonAuctions.add(wonAuction);
                }
            }
        }

        return wonAuctions;
    }
    
    public User findUserWonByAction(Auction auctions) throws SQLException{
    	User userWon = null;
    	try(PreparedStatement pstatement = connection.prepareStatement(SELECT_USER_BY_AUCTION);){
			try(ResultSet result = pstatement.executeQuery();){
				if(result.next()) {
					userWon = new User();
					userWon.setId(result.getInt("userID"));
					userWon.setUsername(result.getString("username"));
					userWon.setAddress(result.getString("address"));
				}
			}
    	}
    	
    	return userWon;
    }
    
}