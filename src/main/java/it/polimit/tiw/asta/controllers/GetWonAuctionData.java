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

import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.beans.WonAuction;
import it.polimit.tiw.asta.dao.WonAuctionDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetWonAuctionData")
public class GetWonAuctionData extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		// find all info of auction tha won by the user
		WonAuctionDAO wonAuctionDAO = new WonAuctionDAO(connection);
		List<WonAuction> wonAuctions = new ArrayList<>();

		try {
			wonAuctions = wonAuctionDAO.findAllAuctionsWonByUser(user.getId());
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// Redirect to the Home page and add wonAuctions to the parameters
		Gson gson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
		String json = gson.toJson(wonAuctions);
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