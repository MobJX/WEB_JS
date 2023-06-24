package it.polimit.tiw.asta.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Item;


public class ItemDAO {

	private Connection con;
	
	private static final String SELECT_ITEM_BY_ID = "SELECT * from Item where itemID=? ";
	private static final String INSERT_ITEM_SQL = "INSERT into Item(itemName,description,itemPrice,isSold,imagePath)"
													+ "VALUES(?,?,?,?,?)"; //去掉了itemID
	private static final String INSERT_AUC_ITEM_SQL = "INSERT into auc_item(aucID, itemID) " + "VALUES(?,?)";
	private static final String UPDATE_ITEM_STATE = "UPDATE Item SET isSold = ?"
													+ "WHERE itemID = ?";
	private static final String SELECT_ITEM_BY_STATUS ="select* from Item where isSold = ?";
	private static final String SELECT_ITEM_BY_KEYWORD = "SELECT * FROM Item WHERE itemName LIKE ? OR description LIKE ? AND isSold=?";
	//SELECT * FROM Item WHERE itemName LIKE '%iphone%' OR description LIKE '%iphone%';
	
	//private static final String SELECT_ITEM_ID_OF_AUCTION_BY_AUCID="Select itemID from auc_item where aucID =?";
	
	private static final String SELECT_ITEM_ID_OF_AUCTION_BY_AUCID ="SELECT * FROM Item WHERE  itemID in (SELECT itemID FROM auc_item  WHERE aucID =?)";
	private static final String SELECT_ITEM_NOT_IN_AUCTION = "SELECT * from Item where itemID not in (SELECT itemID FROM auc_item)";       
	
	
	
	public ItemDAO(Connection connection ) {
		this.con=connection;
		
	}
	
	
	public Item findItem(int i) throws SQLException {
		Item item = null;
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_BY_ID)){
			pstatement.setInt(1, i);
			try(ResultSet result = pstatement.executeQuery();){
				if(result.next()) {
					item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					
				}
				
			}
		}
		return item;
	}
	
	public List<Item> findItem(List<Integer> itemIDs) throws SQLException{
		List<Item> items = new ArrayList<Item>();
		Item item = null;
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_BY_ID)){
			for(int i=0; i < itemIDs.size(); i++) {
				pstatement.setInt(1, itemIDs.get(i));
				try(ResultSet result = pstatement.executeQuery();){
					while(result.next()) {
						item = new Item();
						item.setItemID(result.getInt("itemID"));
						item.setItemName(result.getString("itemName"));
						item.setDescription(result.getString("description"));
						item.setItemPrice(result.getFloat("itemPrice"));
						item.setSold(result.getBoolean("isSold"));
						item.setImagePath(result.getString("imagePath"));
						items.add(item);
					}
				}
			}
		}
		return items;
		
	}
	
	
	public int createItem (Item item) throws SQLException {
		
		try(PreparedStatement pstatement = con.prepareStatement(INSERT_ITEM_SQL, Statement.RETURN_GENERATED_KEYS);){
			//pstatement.setInt(1, id); itemID autogenerato da DB
			pstatement.setString(1, item.getItemName());
			pstatement.setString(2, item.getDescription());
			pstatement.setFloat(3, item.getItemPrice() );
			pstatement.setBoolean(4, item.isSold());
			pstatement.setString(5, item.getImagePath());
			pstatement.executeUpdate();
			try (ResultSet generatedKeys = pstatement.getGeneratedKeys()) {
	            if (generatedKeys.next()) {
	                return generatedKeys.getInt(1);
	            } else {
	                throw new SQLException("Creating item failed");
	            }
	        }
		}
	}
	
	
	public void insertItemInAuction (Auction auction, Item item) throws SQLException {
		
		try(PreparedStatement pstatement = con.prepareStatement(INSERT_AUC_ITEM_SQL);){
			//pstatement.setInt(1, id); itemID autogenerato da DB
			pstatement.setInt(1, auction.getAucID());
			pstatement.setInt(2, item.getItemID());
			pstatement.executeUpdate();
			
		}
	}
	
	public boolean updateItemState (Item item) throws SQLException {
		boolean isSold = true;
		boolean rowUpdated;
		try(PreparedStatement pstatement = con.prepareStatement(UPDATE_ITEM_STATE);){
			pstatement.setBoolean(1,isSold);
			pstatement.setInt(2, item.getItemID());
			//if succeed will be true, if failed will be false  
			rowUpdated = pstatement.executeUpdate()>0;
			
		}
		
		
		return rowUpdated;
		
	}
	
	/**
	 * find all  unsold item
	 * @return
	 * @throws SQLException 
	 */
	
	public List<Item> findAllItemUnSold() throws SQLException{
		List<Item> unSoldItems = new ArrayList<Item>();
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_BY_STATUS);){
			pstatement.setBoolean(1, false);
			try(ResultSet result = pstatement.executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					unSoldItems.add(item);
				}
				
			}
		}
		return unSoldItems;
		
	}
	
	/**
	 * find product with specific keyword
	 * this methods return all the itemID that contains keyword
	 * @return List<Integer>
	 * @throws SQLException 
	 */
	public List<Item> findItemWithKeyWord(String keyword) throws SQLException{
		List<Item> itemIDs = new ArrayList<Item>();
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_BY_KEYWORD);){
			pstatement.setString(1, "%"+keyword+"%");
			pstatement.setString(2,"%"+keyword+"%");
			pstatement.setBoolean(3, false);
			try(ResultSet result = pstatement.executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					itemIDs.add(item);
				}	
			}
		}
		
		
		return itemIDs;
		
	}
	
	public List<Integer> findItem_ID_WithKeyWord(String keyword) throws SQLException{
		List<Integer> itemIDs = new ArrayList<Integer>();
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_BY_KEYWORD);){
			pstatement.setString(1, "%"+keyword+"%");
			pstatement.setString(2,"%"+keyword+"%");
			pstatement.setBoolean(3, false);
			try(ResultSet result = pstatement.executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					itemIDs.add(item.getItemID());
				}	
			}
		}
		
		
		return itemIDs;
		
	}
	
	/**
	 * with specific aucID it returns all the item's id of that auction using table auc_item
	 * @param aucID
	 * @return
	 * @throws SQLException
	 */
	public List<Integer> findAll_ItemID_OfAuction( int aucID ) throws SQLException{
		List<Integer> items = new ArrayList<Integer>();
		
		try(PreparedStatement pstatement = con.prepareStatement( SELECT_ITEM_ID_OF_AUCTION_BY_AUCID);){
			// 需要将 pstatement.setInt(0, aucID); 改为 pstatement.setInt(1, aucID);。这是因为 PreparedStatement 中参数的索引从 1 开始而不是从 0 开始
			//pstatement.setInt(0, aucID); ERRORE!!!!!!
			pstatement.setInt(1, aucID);
			try(ResultSet result = pstatement .executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					
				items.add(item.getItemID());
				
				}
			}
		}
		return items;
	}
	
	/**
	 * with specific aucID it returns all the item's id of that auction using table auc_item
	 * @param aucID
	 * @return
	 * @throws SQLException
	 */
	public List<Item> findAll_Item_OfAuction( int aucID ) throws SQLException{
		System.out.println("Is founding items for the auction " + aucID);
		List<Item> items = new ArrayList<Item>();
		
		try(PreparedStatement pstatement = con.prepareStatement( SELECT_ITEM_ID_OF_AUCTION_BY_AUCID);){
			// 需要将 pstatement.setInt(0, aucID); 改为 pstatement.setInt(1, aucID);。这是因为 PreparedStatement 中参数的索引从 1 开始而不是从 0 开始
			//pstatement.setInt(0, aucID); ERRORE!!!!!!
			pstatement.setInt(1, aucID);
			try(ResultSet result = pstatement .executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					System.out.println(item.getItemName());
				items.add(item);
				
				}
			}
		}
		return items;
	}
	
	/**
	 * find all not auctioned item
	 * @return
	 * @throws SQLException
	 */
	public List<Item> findAll_Item_Not_In_Auctioned() throws SQLException{
		List<Item> IDs = new ArrayList<Item>();
		
		try(PreparedStatement pstatement = con.prepareStatement(SELECT_ITEM_NOT_IN_AUCTION);){
			try(ResultSet result = pstatement .executeQuery();){
				while(result.next()) {
					Item item = new Item();
					item.setItemID(result.getInt("itemID"));
					item.setItemName(result.getString("itemName"));
					item.setDescription(result.getString("description"));
					item.setItemPrice(result.getFloat("itemPrice"));
					item.setSold(result.getBoolean("isSold"));
					item.setImagePath(result.getString("imagePath"));
					
					IDs.add(item);
				
				}
			}
		}
		
		
		
		return IDs;
	}
	
	
	
}	