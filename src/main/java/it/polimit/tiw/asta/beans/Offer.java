package it.polimit.tiw.asta.beans;


import java.util.Date;

public class Offer {
	
	private int offerID;
	private int userID;
	private int aucID;
	private float offerPrice;
	private Date offerDayTime;
	private String userName;
	
	public Offer() {
		super();
	}
	
	public Offer(int offerID, int userID, int aucID, float offerPrice, Date offerDayTime, String userName) {
		super();
		this.offerID = offerID;
		this.userID = userID;
		this.aucID = aucID;
		this.offerPrice = offerPrice;
		this.setOfferDayTime(offerDayTime);
		this.userName = userName;
	}
	
	

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public int getOfferID() {
		return offerID;
	}

	public void setOfferID(int offerID) {
		this.offerID = offerID;
	}

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public int getAucID() {
		return aucID;
	}

	public void setAucID(int aucID) {
		this.aucID = aucID;
	}

	public float getOfferPrice() {
		return offerPrice;
	}

	public void setOfferPrice(float offerPrice) {
		this.offerPrice = offerPrice;
	}

	public Date getOfferDayTime() {
		return offerDayTime;
	}

	public void setOfferDayTime(Date offerDayTime) {
		this.offerDayTime = offerDayTime;
	}

	
	

}