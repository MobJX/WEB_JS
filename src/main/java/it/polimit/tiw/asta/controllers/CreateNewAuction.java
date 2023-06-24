package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.ItemDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;

@WebServlet("/CreateNewAuction")
public class CreateNewAuction extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
    public CreateNewAuction() {
        super();
    }
	

    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		
		System.out.println("----------Create a new Auc Item SERVLET---------");
		boolean isBadRequest = false;
		String[] selectedItems = null;
		String expiryDateTimeStr = null;
		String minUP = null;
		Date expiryDateTime = null;
		
		try {
			selectedItems = request.getParameterValues("selectedItems");
			expiryDateTimeStr = request.getParameter("expiryDateTime");
			minUP = request.getParameter("minUP");
			
			isBadRequest = selectedItems.length==0 || expiryDateTimeStr.isEmpty() || minUP.isEmpty();
		} catch (NumberFormatException | NullPointerException e) {
			isBadRequest = true;
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
			return;
		}
		

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		LocalDateTime localDateTime = LocalDateTime.parse(expiryDateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
		expiryDateTime = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
		
		float totalPrice = 0;
		ItemDAO itemDAO = new ItemDAO(connection);
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		List<Item> aucitems = new ArrayList<>();
		Auction auction = null;
		try {
			
			// for all itemID selected count the price
			for (String itemId : selectedItems) {
			    Item item = itemDAO.findItem(Integer.parseInt(itemId));
			    totalPrice += item.getItemPrice();
			}
			
			// create a new auction
			auction = new Auction(user.getId(),totalPrice,Integer.parseInt(minUP),expiryDateTime);
			
			//update auction SQL
			//auctionDAO.createAuction(auction);
			int newAucID = auctionDAO.createAuction(auction);
			auction.setAucID(newAucID);
			
			// return a list of item in this auction to NewAuction
			aucitems = itemDAO.findAll_Item_OfAuction(auction.getAucID());
			auction.setAucItems(aucitems);
			
			// update auc_item SQL
			for (String itemId : selectedItems) {
			    Item item = itemDAO.findItem(Integer.parseInt(itemId));
			    System.out.println("INTERNO AUCID: " + auction.getAucID());
			    itemDAO.insertItemInAuction(auction, item);
			    
			}

			
		} catch (SQLException e){
			e.printStackTrace();
		}

		// Convert item to JSON
				String json = new Gson().toJson(auction);
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().write(json);

	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
