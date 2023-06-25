package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Duration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.ItemDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetAuctionData")
public class GetAuctionData extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetAuctionData() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

		// get and check params
		Integer aucID = null;
		
		Auction auction = null;
		List<Item> items = null;
		
		ItemDAO itemDAO = new ItemDAO(connection);
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		
		try {
			aucID = Integer.parseInt(request.getParameter("aucID"));
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}

		try {
			//verify that auction exists or not
			auction = auctionDAO.findAuction(aucID);
			
			if (auction == null) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().println("Resource not found");
				return;
			}
			
			System.out.println("Founded auction " + auction.getAucID());
			//find all of item in this auction 
			items = itemDAO.findAll_Item_OfAuction(auction.getAucID());
			auction.setAucItems(items);

		} catch (SQLException e) {
			e.printStackTrace();
			//response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to recover mission");
			return;
		}

		Gson gson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
		String json = gson.toJson(auction);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);

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
