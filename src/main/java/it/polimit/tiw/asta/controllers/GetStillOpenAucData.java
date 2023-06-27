package it.polimit.tiw.asta.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimit.tiw.asta.beans.Auction;
import it.polimit.tiw.asta.dao.AuctionDAO;
import it.polimit.tiw.asta.utils.ConnectionHandler;
import it.polimit.tiw.asta.utils.DurationSerializer;

@WebServlet("/GetStillOpenAucData")
@MultipartConfig
public class GetStillOpenAucData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	// TODO completare questa servlet
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

		// GETTING PARAMETER PHASE

		// get JsonString
		BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
		String jsonString = "";
		if (reader != null) {
			jsonString = reader.readLine();
		}

		// Print JsonString
		System.out.println("Received JSON String: " + jsonString); // ONLY FOR DEBUGGING //TODO COMMENT THIS LINE

		// 使用 Gson 解析 JSON 字符串为对象或数组
		Gson gson = new Gson();
		String[] idArray = gson.fromJson(jsonString, String[].class);
		
		int[] intArray = new int[idArray.length];
		for (int i = 0; i < idArray.length; i++) {
		    intArray[i] = Integer.parseInt(idArray[i]);
		    System.out.println("This is INT : " + intArray[i]); //Only for DEBUGGING //TODO COMMENT THIS LINE
		}
		
		
		/*
		for (String value : idArray) {
		System.out.println("this is idArray；" + value);  delete this ONLY FOR TESTING
		}*/
		
		

		// CHECKING STATUS PHASE

		// after get those Auction id
		// check its stauts
		// return list of auction which has status isClosed = false;
		AuctionDAO auctionDAO = new AuctionDAO(connection);
		List<Auction> aucOpenList = new ArrayList<Auction>();
		Auction auc = null;
		Duration remaingTimes = null;
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime expiry;
		
		for (int id : intArray) {
			try {
				auc = auctionDAO.findAuctionStillOpen(id);
				if(auc!=null) {
					expiry = auc.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
					remaingTimes = Duration.between(now, expiry);
					auc.setRemaingTimes(remaingTimes);
					aucOpenList.add(auc);
					//TODO Sort base on Remainning Time
					
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
			    
				//sort the list base on End Time which further date auction will be positioned on the top of list
				Collections.sort(aucOpenList, new Comparator<Auction>() {
				    @Override
				    public int compare(Auction auc1, Auction auc2) {
				        LocalDateTime expiry1 = auc1.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
				        LocalDateTime expiry2 = auc2.getExpiryDateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
				        
				        // 按照结束日期从大到小排序，将最远的日期放在头部
				        return expiry2.compareTo(expiry1);
				    }
				});
				
//Only for Testing				
//		for(Auction a : aucOpenList) {
//			System.out.println("this is auctionID:"+a.getAucID()+"with End Date:"+a.getExpiryDateTime());
//		}
		
		if(aucOpenList.size()==0) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.getWriter().println("All those auctions are closed!");
			return;
		}else {
			
			// Redirect to the Home page and add auctions to the parameters
			Gson Aucgson = new GsonBuilder().registerTypeAdapter(Duration.class, new DurationSerializer()).create();
			String json = Aucgson.toJson(aucOpenList);

			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(json);
			
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
