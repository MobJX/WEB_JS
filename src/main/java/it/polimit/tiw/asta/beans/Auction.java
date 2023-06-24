package it.polimit.tiw.asta.beans;



import java.util.Date;
import java.util.List;

import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.beans.User;

import java.time.Duration;
import java.util.ArrayList;

public class Auction {
	private int aucID;
	private int ownerID;
	private float aucPrice;
	private float minUP;
	private Date expiryDateTime;
	private boolean isClosed;
	private List<Item> aucItems;
	private float maxOffer;
	//private Duration remaingTimes;
	private User bidder;
	
	public Auction() {
		super();
	}
	

		public Auction(int aucID, int ownerID, float aucPrice, float minUP, Date expiryDateTime, boolean isClosed) {
		super();
		this.aucID = aucID;
		this.ownerID = ownerID;
		this.aucPrice = aucPrice;
		this.minUP = minUP;
		this.expiryDateTime = expiryDateTime;
		this.isClosed = isClosed;
	}


		public int getAucID() {
			return aucID;
		}


		public void setAucID(int aucID) {
			this.aucID = aucID;
		}


		public int getOwnerID() {
			return ownerID;
		}


		public void setOwnerID(int ownerID) {
			this.ownerID = ownerID;
		}


		public float getAucPrice() {
			return aucPrice;
		}


		public void setAucPrice(float aucPrice) {
			this.aucPrice = aucPrice;
		}


		public float getMinUP() {
			return minUP;
		}


		public void setMinUP(float minUP) {
			this.minUP = minUP;
		}


		public Date getExpiryDateTime() {
			return expiryDateTime;
		}


		public void setExpiryDateTime(Date expiryDateTime) {
			this.expiryDateTime = expiryDateTime;
		}


		public boolean isClosed() {
			return isClosed;
		}


		public void setClosed(boolean isClosed) {
			this.isClosed = isClosed;
		}


		public float getMaxOffer() {
			return maxOffer;
		}


		public void setMaxOffer(float maxOffer) {
			this.maxOffer = maxOffer;
		}


		public User getBidder() {
			return bidder;
		}


		public void setBidder(User bidder) {
			this.bidder = bidder;
		}


		public List<Item> getAucItems() {
			return aucItems;
		}


		public void setAucItems(List<Item> aucItems) {
			this.aucItems = aucItems;
		}

/*
		public Duration getRemaingTimes() {
			return remaingTimes;
		}


		public void setRemaingTimes(Duration remaingTimes) {
			this.remaingTimes = remaingTimes;
		}


		public String getBidder() {
			return bidder;
		}


		public void setBidder(String bidder) {
			this.bidder = bidder;
		}

	
	*/
	
	
	
	
}