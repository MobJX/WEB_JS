package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimit.tiw.asta.beans.Offer;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.OfferDAO;
import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.ItemDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetOpenAuction")
public class GetOpenAuction extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public GetOpenAuction() {
		super();
	}

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		System.out.println("My open auction: " + user.getUsername()); 

		ItemDAO itemDAO = new ItemDAO(connection);
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		OfferDAO offerDAO = new OfferDAO(connection);

		List<Auction> aucON = new ArrayList<>();
		List<Item> itemsON = new ArrayList<>();
		List<Offer> offers = new ArrayList<>();
		float maxOffer = 0;
		Duration remaingTimes = null;
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime expiry;

		try {
			// Open Auctions
			aucON = auctionDAO.findAllAuctionON(user.getId());
			for (Auction auc : aucON) {
				maxOffer = 0;
				itemsON = itemDAO.findAll_Item_OfAuction(auc.getAucID());
				offers = offerDAO.findAllOfferOfAuction(auc);
				for (Offer offer : offers) {
					if (offer.getOfferPrice() > maxOffer) {
						maxOffer = offer.getOfferPrice();
					}
				}
				expiry = auc.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
				remaingTimes = Duration.between(now, expiry);
				auc.setRemaingTimes(remaingTimes);
				auc.setMaxOffer(maxOffer);
				auc.setAucItems(itemsON);
			}
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover item");
			return;
		
		}
		
		 // 按照结束日期（EndDate）对aucOpenList进行排序
		//sort the list base on End Time which further date auction will be positioned on the top of list
		Collections.sort(aucON, new Comparator<Auction>() {
		    @Override
		    public int compare(Auction auc1, Auction auc2) {
		        LocalDateTime expiry1 = auc1.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
		        LocalDateTime expiry2 = auc2.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
		        
		        // 按照结束日期从大到小排序，将最远的日期放在头部
		        return expiry2.compareTo(expiry1);
		    }
		});
		

		// Redirect to the Home page and add items to the parameters
		Gson gson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
		String json = gson.toJson(aucON);
		//System.out.println(json);
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