package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.lang.String;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.dao.ItemDAO;

@WebServlet("/GetAvailableItem")
public class GetAvailableItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public GetAvailableItem() {
		super();
	}

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		
		List<Item> items = new ArrayList<Item>();
		ItemDAO itemDAO = new ItemDAO(connection);
		try {
			items = itemDAO.findAll_Item_Not_In_Auctioned();
		} catch(SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover item");
			return;
		}
		

		// Redirect to the Home page and add items to the parameters
				String json = new Gson().toJson(items);
				System.out.println(json);
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