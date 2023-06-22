
{
    let wonAuctionList=null;
    let offerbutton = document.getElementById('id_givenOfferButton');
    

    window.addEventListener("load",function() {
        wonAuctionList = new WonAuctionList(
            document.getElementById("id_wonAuctionContainer"),
            document.getElementById("id_wonAuctionContainerBody")
        );
       // wonAuctionList.reset();
    },false);

    offerbutton.addEventListener("click",function () {
        wonAuctionList.show();
    } ,false);




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

}
