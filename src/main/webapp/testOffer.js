{
    let keyAucList = null;
     let offerList = null;
     let wonAuctionList = null;
     let itemList = null;

    let searchKeywordForm = document.getElementById('id_getKeyAuctionForm')
    let keywordInput = document.getElementById('id_keyword');
    let giveOfferForm = document.getElementById('id_giveOfferForm');
    let alertContainer = document.getElementById('id_alert');

   
   

    window.addEventListener("load",function() {
        keyAucList = new KeyAuctionList(
            document.getElementById("id_keyAuclistContainer"),
            document.getElementById("id_keyAuclistContainerBody")
        );
        offerList = new OfferList(
            document.getElementById("id_offerlistContainer"),
            document.getElementById("id_offerlistContainerBody")
        );
        wonAuctionList = new WonAuctionList(
            document.getElementById("id_wonAuctionContainer"),
            document.getElementById("id_wonAuctionContainerBody")
        );
        itemList = new ItemDetailList(
			document.getElementById("id_itemlistContainer"),
			document.getElementById("id_itemlistContainerBody")
		)
        
		
       // keyAucList.reset();
        //offerList.reset();
    },false);

    searchKeywordForm.addEventListener("submit",function (e) {
		e.preventDefault();
        let keyword = keywordInput.value;
        if (keyword === "") {
            alert("Insert a keyword!");
            return;
        }
        keyAucList.show(keyword);
    },false);

    giveOfferForm.addEventListener("submit",function (e) {
      let form = e.target.closet("form");
      if (form.checkValidity()) {
          let input = form.querySelector("input[type='hidden']");
      }
    } ,false);



    //KeyAuctionList VIEW COMPONENT
    function KeyAuctionList(container,listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        
        

        this.show= function (keyword){
            let self = this;
            
            let urlToCall = "GetKeyAuctionList?keyword="+keyword;
            makeCall("GET",urlToCall,null,function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let keyAucToShow = JSON.parse(req.responseText);
                        if (keyAucToShow.length === 0) {
                            alertContainer.textContent = "No keyAuction yet!";
                            return;
                        }
                        self.update(keyAucToShow);
                        //self.listcontainer.classList.remove("hidden");
                    } else {
                        alertContainer.textContent = req.responseText;
                    }
                }
            })
        }
        this.update = function (arrayAuctions) {
            let row;
            let auctionIdCell;
            let ownerCell;
            let priceCell;
            let minUpCell;
            let endDateCell;
            let statusCell;
            let linkCell;
            let linktext;
            let anchor;

            this.listcontainerbody.innerHTML = "";

            //build updated list of auctions
            let self = this;
            arrayAuctions.forEach(function (auction) {
                row = document.createElement("tr");
                auctionIdCell = document.createElement("td");
                auctionIdCell.textContent = auction.aucID;
                row.appendChild(auctionIdCell);
                ownerCell = document.createElement("td");
                ownerCell.textContent = auction.ownerID;
                row.appendChild(ownerCell);
                priceCell = document.createElement("td");
                priceCell.textContent = auction.aucPrice;
                row.appendChild(priceCell);
                minUpCell = document.createElement("td");
                minUpCell.textContent = auction.minUP;
                row.appendChild(minUpCell);
                endDateCell = document.createElement("td");
                endDateCell.textContent = auction.expiryDateTime;
                row.appendChild(endDateCell);
                statusCell = document.createElement("td");
                statusCell.textContent = auction.isClosed;
                row.appendChild(statusCell);

                linkCell = document.createElement("td");
                anchor = document.createElement("a");
                linkCell.appendChild(anchor);
                linktext = document.createTextNode("Details");
                anchor.appendChild(linktext);
                anchor.setAttribute("keyAucID",auction.aucID);
                anchor.addEventListener("click",function (e) {
                    e.preventDefault();
                    wonAuctionList.show();
                    alertContainer.textContent = "";
                    let auctionID = e.target.getAttribute("keyAucID");
                    let urlToCall = "GetOfferData?aucID=" + auctionID;
                    //after clicking on the details shows the details of items and wonAuction of user
                    
                    itemList.show(auctionID);
                    makeCall("GET", urlToCall, null, function (req) {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                let offerToShow = JSON.parse(req.responseText);
                                if (offerToShow.length === 0) {
                                    alertContainer.textContent = "No offer yet!";
                                    return;
                                }
                                offerList.update(offerToShow);
                               // offerContainer.classList.remove("hidden");
                            } else {
                                alertContainer.textContent = req.responseText;
                            }
                        }
                    });
                   
                    

                },false);
				
                linkCell.appendChild(anchor);
                anchor.href = '#';
                row.appendChild(linkCell);
                self.listcontainerbody.appendChild(row);
            });


        }
        this.reset = function () {
          this.listcontainer.innerHTML = "";
          this.listcontainer.classList.add("hidden");
        }

    }
    
//OffernList VIEW COMPONENT
    function OfferList(container,listcontainer){
		
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;

        this.show = function (aucID) {
            let self = this;
            let urlToCall = "GetOfferData?aucID="+aucID;
            makeCall("GET",urlToCall,null,function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let offerToShow = JSON.parse(req.responseText);
                        if (offerToShow.length === 0) {
                            alertContainer.textContent = "No offer yet!";
                            return;
                        }
                        self.update(offerToShow);
                        self.listcontainer.classList.remove("hidden");
                    } else {
                        alertContainer.textContent = req.responseText;
                    }
                }
            })
        }
        this.update = function (arrayOffers) {
            let row;
            let offerIdCell;
            let userIdCell;
            let aucIdCell;
            let offerCell;
            let offerDateCell;


            this.listcontainerbody.innerHTML = "";
            let self = this;
            arrayOffers.forEach(function (offer) {
                row = document.createElement("tr");
                offerIdCell = document.createElement("td");
                offerIdCell.textContent = offer.offerID;
                row.appendChild(offerIdCell);
                userIdCell = document.createElement("td");
                userIdCell.textContent = offer.userID;
                row.appendChild(userIdCell);
                aucIdCell = document.createElement("td");
                aucIdCell.textContent = offer.aucID;
                row.appendChild(aucIdCell);
                offerCell = document.createElement("td");
                offerCell.textContent = offer.offerPrice;
                row.appendChild(offerCell);
                offerDateCell = document.createElement("td");
                offerDateCell.textContent = offer.offerDayTime;
                row.appendChild(offerDateCell);
                self.listcontainerbody.appendChild(row);

            });

        }


        this.reset= function () {
            this.listcontainer.innerHTML = "";
          	this.listcontainer.classList.add("hidden");
        }
    }
    
    //WonAuctionList VIEW COMPONENT
    function WonAuctionList(container,listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset= function () {
            this.listcontainer.style.visibility = "hidden";
        }

        this.show= function (){
            let self = this;

            let urlToCall = "GetWonAuctionData";
            makeCall("GET",urlToCall,null,function (req) {

                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let wonAucToShow = JSON.parse(req.responseText);
                        if (wonAucToShow.length === 0) {
                            alertContainer.textContent = "No wonAuction yet!";
                            return;
                        }
                        self.update(wonAucToShow);
                        self.listcontainer.classList.remove("hidden");
                    } else {
                        alertContainer.textContent = req.responseText;
                    }
                }
            })
        }

        this.update= function (wonAucToShow) {
           let row;
           let auctionIDCell;
           let auctionPriceCell;
           let finalPriceCell;
           let endDateCell;

              this.listcontainerbody.innerHTML = "";
              let self = this;
                wonAucToShow.forEach(function (wonAuction) {
                    row = self.listcontainerbody.insertRow();
                    auctionIDCell = row.insertCell();
                    auctionIDCell.textContent = wonAuction.aucID;
                    auctionPriceCell = row.insertCell();
                    auctionPriceCell.textContent = wonAuction.aucPrice;
                    finalPriceCell = row.insertCell();
                    finalPriceCell.textContent = wonAuction.winningBid;
                    endDateCell = row.insertCell();
                    endDateCell.textContent = wonAuction.expiryDateTime;

                });
        }
    }
    
    
    //Item Details Of Auction VIEW COMPONENT
    function ItemDetailList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;

        this.show = function (aucID) {
            let self = this;
            let urlToCall = "GetItemData?aucID=" + aucID;
            makeCall("GET", urlToCall, null, function (req) {
                if (req.readyState === XMLHttpRequest.DONE) {
                    let message = req.responseText;
                    if (req.status === 200) {
                        let itemToShow = JSON.parse(req.responseText);
                        if (itemToShow.length === 0) {
                            self.listcontainerbody.innerHTML = "No items found.";
                            return;
                        }
                        self.update(itemToShow);
                    }
                }

            });
            this.update = function (arrayItems) {
                let row;
                let itemIDCell;
                let itemNameCell;
                let itemDescriptionCell;
                let itemPriceCell;
                let itemImageCell;

                this.listcontainerbody.innerHTML = "";
                arrayItems.forEach(function (item) {
                    row = self.listcontainerbody.insertRow();
                    itemIDCell = row.insertCell();
                    itemNameCell = row.insertCell();
                    itemDescriptionCell = row.insertCell();
                    itemPriceCell = row.insertCell();
                    itemImageCell = row.insertCell();
                    itemIDCell.textContent = item.itemID;
                    itemNameCell.textContent = item.itemName;
                    itemDescriptionCell.textContent = item.description;
                    itemPriceCell.textContent = item.itemPrice;
                
					// create<img>TAG，and setting src URL
					let img = document.createElement("img");
					img.src = item.imagePath;
					img.style.maxWidth = "200px";
					img.style.maxHeight = "180px";
					itemImageCell.appendChild(img);

				});

			}


        }
    }
    
    
    
}