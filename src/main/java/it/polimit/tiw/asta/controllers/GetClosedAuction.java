package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimit.tiw.asta.dao.UserDAO;
import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Offer;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.OfferDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetClosedAuction")
public class GetClosedAuction extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public GetClosedAuction() {
		super();
	}

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		System.out.println("--------------------CREATE A CLOSE AUCTION SERVLET----------------");
		UserDAO userDAO = new UserDAO(connection);
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		OfferDAO offerDAO = new OfferDAO(connection);

		List<Auction> aucOFF = new ArrayList<>();
		List<Offer> offers = new ArrayList<>();
		User bidder = null;
		float maxOffer = 0;

		try {
			// Closed Auctions
			aucOFF = auctionDAO.findAllAuctionOFF(user);
			if	(aucOFF==null||aucOFF.size()==0) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to recover item");
				return;
			}
			for (Auction auc : aucOFF) {
				maxOffer = 0;
				offers = offerDAO.findAllOfferOfAuction(auc);
				for (Offer offer : offers) {
					if (offer.getOfferPrice() > maxOffer) {
						maxOffer = offer.getOfferPrice();
					}
				}
				bidder = userDAO.findUserOfAuction(auc);
				auc.setBidder(bidder);
				auc.setMaxOffer(maxOffer);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover item");
			return;
		}

		// Redirect to the Home page and add items to the parameters
		Gson gson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
		String json = gson.toJson(aucOFF);
		System.out.println("This is the closed auction:" + json);

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
