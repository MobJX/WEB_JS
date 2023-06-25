package it.polimit.tiw.asta.controllers;

import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import it.polimit.tiw.asta.utils.ConnectionHandler;

@WebServlet("/GetStillOpenAucData")
public class GetStillOpenAucData extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	//TODO completare questa servlet
	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		String jasonString = request.getParameter("json");
		try {
			String decodedJsonString = java.net.URLDecoder.decode(jasonString,"UTF-8");
			Gson gson = new Gson();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
