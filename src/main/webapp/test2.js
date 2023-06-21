{
    let keyAucList = null;
    let searchKeywordButton = document.getElementById('id_keywordButton');
    let keywordInput = document.getElementById('id_keyword');

    window.addEventListener("load",function() {
        keyAucList = new KeyAuctionList(
            document.getElementById("id_keyAuclistContainer"),
            document.getElementById("id_keyAuclistContainerBody")
        );
        keyAucList.reset();
    },false);

    searchKeywordButton.addEventListener("click",function () {
        let keyword = keywordInput.value;
        if (keyword === "") {
            alert("Insert a keyword!");
            return;
        }
       keyAucList.show(keyword);
    },false);

    //KeyAuctionList VIEW COMPONENT
    function KeyAuctionList(container,listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset= function () {
            this.listcontainer.style.visibility = "hidden";
        }

        this.show= function (keyword){
            let self = this;
            //this.listcontainer.querySelector("P").textContent = "Auction containing: "+keyword;
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
                        self.listcontainer.style.visibility = "visible";
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
                    alertContainer.textContent = "";
                    let selectedAuction = e.target.closest("table").querySelector("TR.selectedAuction");
                    if (selectedAuction !== null) {
                        selectedAuction.classList.remove("selectedAuction");
                    }
                    e.target.parentNode.parentNode.classList.add("selectedAuction");

                    /**
                     * Update the status of  the view:
                     */

                },false);

                linkCell.appendChild(anchor);
                anchor.href = '#';
                row.appendChild(linkCell);
                self.listcontainerbody.appendChild(row);
            });


        }
        this.reset = function () {
            this.listcontainer.style.visibility = "hidden";
        }
    }

}