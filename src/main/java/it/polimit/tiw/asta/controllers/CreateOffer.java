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
import it.polimit.tiw.asta.utils.ConnectionHandler;

@WebServlet("/CreateOffer")
public class CreateOffer extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		boolean isBadRequest = false;
		 int auctionId;
		 float userBid;
		 try {
			auctionId = Integer.parseInt(request.getParameter("auctionID"));
			userBid = Float.parseFloat(request.getParameter("offer"));
				} catch (NumberFormatException | NullPointerException e) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("incorrect format of input");
					return;
			}

		isBadRequest = auctionId < 0 || userBid < 0 ;
		 if (isBadRequest) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Incorrect or missing param values");
				return;
			}
		 
		 

			// Create Offer in DB
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("user");
			OfferDAO offerDAO = new OfferDAO(connection);
			Offer newOffer = new Offer();
			
	        newOffer.setAucID(auctionId);
	        newOffer.setUserID(user.getId());
	        newOffer.setOfferPrice(userBid);
	        try {
	            offerDAO.createOffer(newOffer);
	        } catch (SQLException e) {
	        	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to create offer");
				return;
	        }
	        
	        
	        List<Offer> offers;
			try {
				offers = offerDAO.findAllOfferOfAuctionByAucId(auctionId);
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible offers");
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
