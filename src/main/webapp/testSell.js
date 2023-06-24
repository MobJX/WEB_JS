{
    //page components
    let availableItemList, openAuctionList, closedAuctionList,
        createNewAuction, pageOrchestrator = new PageOrchestrator();

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

        this.update = function (availableItemList) {
            var row1, row2, row3, itemIDCell, itemNameCell, itemDescriptionCell, itemPriceCell,
                itemImageCell, itemSelectCell, checkbox, auctionExpiryDateTime, auctionMinUP;
            this.availableIemListBody.innerHTML = "";   // empty the table body
            // build updated list
            let self = this;
            availableItemList.forEach(function (item) {
                row1 = document.createElement("tr");
                itemIDCell = document.createElement("td");
                itemIDCell.textContent = item.itemID;
                row1.appendChild(itemIDCell);
                itemNameCell = document.createElement("td");
                itemNameCell.textContent = item.itemName;
                row1.appendChild(itemNameCell);
                itemDescriptionCell = document.createElement("td");
                itemDescriptionCell.textContent = item.description;
                row1.appendChild(itemDescriptionCell);
                itemPriceCell = document.createElement("td");
                itemPriceCell.textContent = item.itemPrice;
                row1.appendChild(itemPriceCell);
                itemImageCell = document.createElement("td");
                itemImageCell.textContent = item.imagePath;
                row1.appendChild(itemImageCell);
                itemSelectCell = document.createElement("td");
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                itemSelectCell.appendChild(checkbox);
                row1.appendChild(itemSelectCell);
                row2 = document.createElement("tr");
                auctionExpiryDateTime = document.createElement("td");
                auctionExpiryDateTime.textContent = auction.expiryDateTime;
                row2.appendChild(auctionExpiryDateTime);
                row3 = document.createElement("tr");
                auctionMinUP = document.createElement("td");
                auctionMinUP.textContent = auction.minUP;
                row3 = document.appendChild(auctionMinUP);
            });
            this.availableItemList.style.visibility = "visible";
        }
    }

    function CreateNewItem(newItem,alert){

    }

    function CreateNewAuction(newAuction, alert) {
        var now = new Date(), formattedDate = now.toISOString().substring(0, 10);
        this.newAuction = newAuction;
        this.alert = alert;
        this.newAuction.querySelector('input[type="datetime-local"]').setAttribute("min", formattedDate);
        this.registerEvents = function (orchestrator) {
            Array.from(this.newAuction.querySelectorAll("input[type='button'].next, input[type='button'].prev")).forEach(b => {
                b.addEventListener("click", (e) => {
                    var eventFieldset = e.target.closest("fieldset"), valid = true;
                    if (e.target.className == "next") {
                        for (i = 0; i < eventFieldset.elements.length; i++) {
                            if (!eventFieldset.elements[i].checkValidity()) {
                                eventFieldset.elements[i].reportValidity();
                                valid = false;
                                break;
                            }
                        }
                    }
                    if (valid) {
                        this.changeStep(e.target.parentNode, (e.target.className === "next") ?
                            e.target.parentNode.nextElementSibling : e.target.parentNode.previousElementSibling);
                    }
                }, false);
            });

            this.newAuction.querySelector("input[type='submit'][name='newAuctionButton']").addEventListener('click', (e) => {
                var eventFieldset = e.target.closest("fieldset"), vaild = true;
                for (let i = 0; i < eventFieldset.elements.lenght; i++) {
                    if (!eventFieldset.elements[i].checkValidity()) {
                        eventFieldset.elements[i].reportValidity();
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    let self = this;
                    makeCall("GET", "CreateNewAuction", e.target.closest("form"),
                        function (req) {
                            if (req.readyState == XMLHttpRequest.DONE) {
                                var message = req.responseText;
                                if (req.status == 200) {
                                    orchestrator.refresh(message);
                                } else if (req.status == 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    self.alert.textContent = message;
                                    self.reset();
                                }
                            }
                        });
                }
            });

            this.newAuction.querySelector("input[type='button'].cancel").addEventListener('click', (e) => {
                e.target.closest('form').reset();
                this.reset();
            });
        };

        this.reset = function () {
            var fieldsets = document.querySelectorAll("#" + this.newAuction.id + " fieldest");
            fieldsets[0].hidden = false;
            fieldsets[1].hidden = true;
        }

        this.changeStep = function (origin, destination) {
            origin.hidden = true;
            destination.hidden = false;
        }
    }

    function PageOrchestrator() {
        var alertContainer = document.getElementById("id_alert");

        this.start = function () {
            personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
            personalMessage.show();

            createNewAuction = new CreateNewAuction(document.getElementById("id_createAuctionForm"), alertContainer);
            createNewAuction.registerEvents(this);
        };

        this.refresh = function (current)
    }

}