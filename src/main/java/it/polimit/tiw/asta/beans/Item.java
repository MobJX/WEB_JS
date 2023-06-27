package it.polimit.tiw.asta.beans;

public class Item {

	private int itemID;
	private String itemName;
	private String description;
	private float itemPrice;
	private String imagePath;
	private boolean isSold;
	private int creatorID;

	public Item() {
		super();
	}

	public Item(String itemName, String desc, float itemPrice, String imagePath, int creatorID) {
		super();
		this.itemName = itemName;
		this.description = desc;
		this.itemPrice = itemPrice;
		this.imagePath = imagePath;
		this.isSold = false;
		this.creatorID = creatorID;
	}

	public int getItemID() {
		return itemID;
	}

	public void setItemID(int itemID) {
		this.itemID = itemID;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public float getItemPrice() {
		return itemPrice;
	}

	public void setItemPrice(float itemPrice) {
		this.itemPrice = itemPrice;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public boolean isSold() {
		return isSold;
	}

	public void setSold(boolean isSold) {
		this.isSold = isSold;
	}

	public int getCreatorID() {
		return creatorID;
	}

	public void setCreatorID(int creatorID) {
		this.creatorID = creatorID;
	}
}