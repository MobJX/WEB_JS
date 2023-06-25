package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import it.polimit.tiw.asta.beans.Offer;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.OfferDAO;
import it.polimit.tiw.asta.dao.UserDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;

@WebServlet("/GetOfferData")
public class GetOfferData extends HttpServlet{
	
	
	public GetOfferData() {
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
        UserDAO userDAO = new UserDAO(connection);
		OfferDAO offerDAO = new OfferDAO(connection);
		List<Offer> offers = null;
		Integer aucID = null;
		
		try {
			aucID = Integer.parseInt(request.getParameter("aucID"));
			
		} catch (NumberFormatException | NullPointerException e) {
			// only for debugging e.printStackTrace();
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
			return;
		}
		
		try {
			offers = offerDAO.findAllOfferOfAuctionByAucId(aucID);
			
			for (Offer offer:offers) {
				User userOffer = userDAO.findUserOfAuctionByOffer(offer);
				offer.setUserName(userOffer.getUsername());
			}
			
		} catch (SQLException   e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover auctions");
			return;
		}
		
		
		
		// Redirect to the Home page and add wonAuctions to the parameters
		String json = new Gson().toJson(offers);
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
