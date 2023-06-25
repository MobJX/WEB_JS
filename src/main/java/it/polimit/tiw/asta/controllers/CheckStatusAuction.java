package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;

@WebServlet("/CheckStatusAuction")
public class CheckStatusAuction extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	public CheckStatusAuction() {
		super();
	}

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// get and check params
		Integer auctionID = null;
		try {
			auctionID = Integer.parseInt(request.getParameter("aucID"));
		} catch (NumberFormatException | NullPointerException e) {
			// for debugging only e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}

		Date now = new Date();
		boolean  canClose = false;
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		Auction auction = null;
		
		try {
			//verify that auction exists or not
			auction = auctionDAO.findAuction(auctionID);
			
			if (auction == null) {
				response.setStatus(HttpServletResponse.SC_PRECONDITION_FAILED);
				response.getWriter().println("Auction not found");
				return;
			}
			
			if (now.after(auction.getExpiryDateTime()) && !auction.isClosed()){
				canClose = true;
			}
			
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Auction not closable");		
			return;
		}

		
		String json = new Gson().toJson(canClose);

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