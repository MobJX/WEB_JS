package it.polimit.tiw.asta.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.beans.User;
import it.polimit.tiw.asta.beans.Item;
import it.polimit.tiw.asta.dao.ItemDAO;


@WebServlet("/CreateNewItem")
public class CreateNewItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public CreateNewItem() {
        super();
    }

    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("----------Create a new Item SERVLET---------");
		boolean isBadRequest = false;
		String itemName = null;
		String itemPrice = null;
		String itemDescription = null;
		String itemImage = null;
		
		try {
			itemName = request.getParameter("itemName");
			itemPrice = request.getParameter("itemPrice");
			itemDescription = request.getParameter("itemDescription");
			itemImage = request.getParameter("itemImage");
			
			isBadRequest = itemName.isEmpty() || itemPrice.isEmpty() || itemDescription.isEmpty() || itemImage.isEmpty();
		} catch (NumberFormatException | NullPointerException e) {
			isBadRequest = true;
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
			return;
		}
		if (isBadRequest) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect or missing param values");
			return;
		}
		
		if (itemPrice == null || !isValidFloat(itemPrice)) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid itemPrice value");
			return;
		}
		
		// Create item in DB
		Item item = new Item(itemName, itemDescription, Float.parseFloat(itemPrice), itemImage);
		ItemDAO itemDAO = new ItemDAO(connection);
		try {
			int newItemID = itemDAO.createItem(item);
			item.setItemID(newItemID);
			System.out.println("ItemID: " + newItemID);
			
		} catch (SQLException e){
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating item");
			return;
		}
		
		// Convert item to JSON
		String json = new Gson().toJson(item);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}

	private boolean isValidFloat(String value) {
		try {
			Float.parseFloat(value);
			return true;
		} catch (NumberFormatException e) {
			return false;
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
