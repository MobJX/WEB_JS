{
    //page components
    let availableItemList, openAuctionList, closedAuctionList,
        wizard, pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
        if (sessionStorage.getItem("username") == null) {
            window.location.href = "index.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();
        }
    }, false);

    function PersonalMessage(_username, messagecontainer) {
        this.username = _username;
        this.show = function () {
            messagecontainer.textContent = this.username;
        }
    }

    function AvailableItemList(_alert, _id_availableItemListContainer, _id_availableItemListBody) {
        this.alert = _alert;
        this.availableItemList = _id_availableItemListContainer;
        this.availableIemListBody = _id_availableItemListBody;
        this.current_availableItemList;

        this.reset = function () {
            this.availableItemList.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetAvailableItem", null,
                function (req) {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            var availbleItemListToShow = JSON.parse(req.responseText);
                            availableItemList.current_availableItemList = availbleItemListToShow;
                            if (availbleItemListToShow.length == 0) {
                                self.alert.textContent = "No available item list entered yet!";
                                return;
                            }
                            self.update(availbleItemListToShow);
                        } else if (req.status == 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem("username");
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };
        
        this.update = function (availableItemList){
            var row, itemIDCell, itemNameCell, itemDescriptionCell,
                itemPriceCell, itemImageCell,itemSelectCell;
            this.availableIemListBody.innerHTML = "";   // empty the table body
            // build updated list
            let self = this;
            availableItemList.forEach(function (item){
                row = document.createElement("tr");
                itemIDCell = document.createElement("td");
                itemIDCell.textContent = item.itemID;
                row.appendChild(itemIDCell);
                itemNameCell = document.createElement("td");
                itemNameCell.textContent = item.itemName;
                row.appendChild(itemNameCell);
                itemDescriptionCell = document.createElement("td");
                itemDescriptionCell.textContent = item.description;
                row.appendChild(itemDescriptionCell);
                itemPriceCell = document.createElement("td");
                itemPriceCell.textContent = item.itemPrice;
                row.appendChild(itemPriceCell);
                itemImageCell = document.createElement("td");
                itemImageCell.textContent = item.imagePath;
                row.appendChild(itemImageCell);
                itemSelectCell

            })
        }

    }
}