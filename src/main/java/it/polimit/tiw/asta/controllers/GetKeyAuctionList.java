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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimit.tiw.asta.beans.Auction;

import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.dao.ItemDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetKeyAuctionList")
public class GetKeyAuctionList extends HttpServlet {
	public GetKeyAuctionList() {
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

		// get and check params
		String keyword = null;

		try {
			keyword = request.getParameter("keyword");
		} catch (NullPointerException e) {
			// only for debugging e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}

		ItemDAO itemDAO = new ItemDAO(connection);
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		// List<Item> items = null;
		List<Integer> itemsID = new ArrayList<Integer>();
		List<Auction> auctions = new ArrayList<Auction>();
		Duration remaingTimes = null;
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime expiry;

		try {
			// items = itemDAO.findItemWithKeyWord(keyword);
			itemsID = itemDAO.findItem_ID_WithKeyWord(keyword);
			if (itemsID == null ) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().println("Resource not found");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover auctions");
			return;
		}

		try {
			auctions = auctionDAO.findAllAuctionWithItemID(itemsID);
			if (auctions == null || auctions.size()== 0 ) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().println("Resource not found");
				return;
			} else {
				
				for(Auction a : auctions) {
					expiry = a.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
					remaingTimes = Duration.between(now, expiry);
					a.setRemaingTimes(remaingTimes);
				}
				
				
				Collections.sort(auctions, new Comparator<Auction>() {
				    @Override
				    public int compare(Auction auc1, Auction auc2) {
				        LocalDateTime expiry1 = auc1.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
				        LocalDateTime expiry2 = auc2.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
				        
				        // 按照结束日期从大到小排序，将最远的日期放在头部
				        return expiry2.compareTo(expiry1);
				    }
				});
				
				// Redirect to the Home page and add auctions to the parameters
				Gson gson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
				String json = gson.toJson(auctions);

				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().write(json);

			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

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
