package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;


@WebServlet("/CloseAuction")
@MultipartConfig
public class CloseAuction extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	public CloseAuction() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// get and check params
		Integer auctionID = null;
		try {
			auctionID = Integer.parseInt(request.getParameter("auctionID"));
		} catch (NumberFormatException | NullPointerException e) {
			// for debugging only e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}

		// Update mission status
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		AuctionDAO auctionDAO = new AuctionDAO(connection);

		try {
			// Check that only the user who created the mission edits it
			Auction auction = auctionDAO.findAuction(auctionID);
			if (auction == null) {
				response.setStatus(HttpServletResponse.SC_PRECONDITION_FAILED);
				response.getWriter().println("Auction not found");
				return;
			}
			auction.setClosed(auctionDAO.closeAuction(auction));
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Auction not closable");		
			return;
		}

	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}