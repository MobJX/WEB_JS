package it.polimit.tiw.asta.controllers;



import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
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
import it.polimit.tiw.asta.beans.Offer;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.beans.WonAuction;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.ItemDAO;
import it.polimit.tiw.asta.dao.OfferDAO;
import it.polimit.tiw.asta.dao.WonAuctionDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;





@WebServlet("/GetAuctionItemData")
public class GetAuctionItemData extends HttpServlet {
	
	
	
	public GetAuctionItemData() {
		super();
		// TODO Auto-generated constructor stub
	}

	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		

		HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

		// get and check params
		Integer aucID = null;
		try {
			aucID = Integer.parseInt(request.getParameter("aucID"));
			
		} catch (NumberFormatException | NullPointerException e) {
			// only for debugging e.printStackTrace();
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
			return;
		}

	
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		Auction auction = null;
		ItemDAO itemDAO = new ItemDAO(connection);
		Item item = null;
		List<Integer> allItemID = new ArrayList<Integer>();
		List<Item> itemsOfAuction = new ArrayList<Item>();
		
		OfferDAO offerDAO = new OfferDAO(connection);
		List<Offer> offers = null;
		
		
		try {
			//verify that auction exists or not
			auction = auctionDAO.findAuction(aucID);
			
			if (auction == null) {
				response.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found");
				return;
			}
			//find all Id of item in this auction 
			
			allItemID = itemDAO.findAll_ItemID_OfAuction(aucID);
			
			offers = offerDAO.findAllOfferOfAuction(auction);
			
		
			if (allItemID == null) {
				response.sendError(HttpServletResponse.SC_NOT_FOUND, "Item ID of AUCTION Resource not found");
				return;
			}
			
			for	(int i = 0; i < allItemID.size();i++) {
			//item = new Item();
			item = itemDAO.findItem(allItemID.get(i));
			itemsOfAuction.add(item);
			}

		} catch (SQLException e) {
			e.printStackTrace();
			//response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to recover mission");
			return;
		}
		
		
		
		//find all info of auction that won by the user
		WonAuctionDAO wonAuctionDAO = new WonAuctionDAO(connection);
		List<WonAuction> wonAuctions = new ArrayList<>();
		
		try {
			wonAuctions = wonAuctionDAO.findAllAuctionsWonByUser(user.getId());
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	
		
	

		// Redirect to the Home page and add offer items and wonAuc to the parameters
		String offerjson = new Gson().toJson(offers);
		String itemjson = new Gson().toJson(itemsOfAuction);
		String wonAucjson = new Gson().toJson(wonAuctions);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(offerjson);
		response.getWriter().write(itemjson);
		response.getWriter().write(wonAucjson);
		
		
		
	
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}