{
    //page components
    let createNewItem, openAuctionList, closedAuctionList, ONautionDetails, ONitemDetails,
        ONofferDetails, OFFautionDetails, OFFitemDetails, OFFofferDetails, createNewAuction,
        availableItemList, closeAuction, pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
        if (sessionStorage.getItem("username") == null) {
            window.location.href = "index.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();
        }
    }, false);

    function PersonalMessage(_username, _messageContainer) {
        this.username = _username;
        this.show = function () {
            _messageContainer.textContent = this.username;
        }
    }

    function CreateNewItem(_alert, _id_createNewItem) {
        this.alert = _alert;
        this.createNewItem = _id_createNewItem;
        this.createItemButton = document.getElementById("id_newItemButton");

        this.registerEvents = function (orchestrator) {
            this.createItemButton.addEventListener('click', (e) => {
                let form = e.target.closest("form");
                if (form.checkValidity()) {
                    e.preventDefault();
                    let self = this;

                    makeCall("POST", 'CreateNewItem', form,
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                var message = req.responseText;
                                if (req.status === 200) {
                                    orchestrator.refresh();
                                    self.alert.textContent = "";
                                    window.alert("Item Created Successfully!");
                                } else if (req.status === 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    self.alert.textContent = message;
                                    //self.reset();
                                }
                            }
                        });
                } else {
                    form.reportValidity();
                }
            });
        };


    }


    function CreateNewAuction(_alert, _id_createNewAuction) {
        var now = new Date(), formattedDate = now.toISOString().substring(0, 10);
        this.alert = _alert;
        this.createNewAuction = _id_createNewAuction;
        this.createAuctionButton = document.getElementById("id_newAuctionButton");
        this.createNewAuction.querySelector('input[type="datetime-local"]').setAttribute("min", formattedDate);

        this.registerEvents = function (orchestrator) {
            Array.from(this.createNewAuction.querySelectorAll("input[type='button'].next, input[type='button'].prev")).forEach(b => {
                b.addEventListener("click", (e) => {
                    e.preventDefault();
                    var eventFieldset = e.target.closest("fieldset"), valid = true;
                    if (e.target.className === "next") {
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

            this.createAuctionButton.addEventListener('click', (e) => {
                let eventFieldset = e.target.closest("fieldset"), valid = true;
                for (let i = 0; i < eventFieldset.elements.length; i++) {
                    if (!eventFieldset.elements[i].checkValidity()) {
                        eventFieldset.elements[i].reportValidity();
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    e.preventDefault();
                    let self = this;
                    makeCall("POST", "CreateNewAuction", e.target.closest("form"),
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                let message = req.responseText;
                                if (req.status === 200) {
                                    orchestrator.refresh();
                                } else if (req.status === 403) {
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

            this.createNewAuction.querySelector("input[type='button'].cancel").addEventListener('click', (e) => {
                e.target.closest('form').reset();
                this.reset();
            });
        };

        this.reset = function () {
            let fieldsets = document.querySelectorAll("#" + this.createNewAuction.id + " fieldset");
            fieldsets[0].hidden = false;
            fieldsets[1].hidden = true;
        }

        this.changeStep = function (origin, destination) {
            origin.hidden = true;
            destination.hidden = false;
        }
    }

    function OpenAuctionList(_alert, _id_openAuction, _id_openAuctionBody) {
        this.alert = _alert;
        this.openAuction = _id_openAuction;
        this.openAuctionBody = _id_openAuctionBody;
        this.openDetails = document.getElementById("id_OpenDetails");

        this.reset = function () {
            this.openDetails.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetOpenAuction", null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let openAuctionToShow = JSON.parse(req.responseText);
                            openAuctionList.current_openAuction = openAuctionToShow;
                            if (openAuctionToShow.length === 0) {
                                self.alert.textContent = "No Open Auction yet!";
                                return;
                            }
                            self.update(openAuctionToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (openAuctionList) {
            let row, rowItem, auctionIDCell, itemsCell, maxOfferCell, timeRemainingCell, linkCell, anchor;
            this.openAuctionBody.innerHTML = "";
            let self = this;
            openAuctionList.forEach(function (auction) {
                row = document.createElement("tr");
                auctionIDCell = document.createElement("td");
                auctionIDCell.textContent = auction.aucID;
                row.appendChild(auctionIDCell);
                itemsCell = document.createElement("td");
                auction.aucItems.forEach(function (item) {
                    rowItem = document.createElement("tr");
                    itemsCell.itemID = document.createElement("td");
                    itemsCell.itemID.textContent = item.itemID;
                    rowItem.appendChild(itemsCell.itemID);
                    itemsCell.itemName = document.createElement("td");
                    itemsCell.itemName.textContent = item.itemName;
                    rowItem.appendChild(itemsCell.itemName);
                });
                row.appendChild(rowItem);
                maxOfferCell = document.createElement("td");
                maxOfferCell.textContent = auction.maxOffer + " €";
                row.appendChild(maxOfferCell);

                function formatDuration(duration) {
                    const seconds = Math.floor((duration / 1000) % 60);
                    const minutes = Math.floor((duration / (1000 * 60)) % 60);
                    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
                    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
                    return `${days} Days ${hours}:${minutes}:${seconds}`;
                }

                timeRemainingCell = document.createElement("td");
                timeRemainingCell.textContent = formatDuration(auction.remaingTimes);
                row.appendChild(timeRemainingCell);
                linkCell = document.createElement("td");
                anchor = document.createElement("a");
                linkCell.appendChild(anchor);
                linkText = document.createTextNode("Details");
                anchor.appendChild(linkText);
                anchor.setAttribute('aucID', auction.aucID);
                anchor.addEventListener("click", (e) => {
                    e.preventDefault();
                    ONautionDetails.show(e.target.getAttribute("aucID"));
                    ONitemDetails.show(e.target.getAttribute("aucID"));
                    ONofferDetails.show(e.target.getAttribute("aucID"));
                    closeAuction.checkStatus(e.target.getAttribute("aucID"));

                }, false);
                anchor.href = "#";
                row.appendChild(linkCell);
                self.openAuctionBody.appendChild(row);
            });
            this.openAuction.style.visibility = "visible";
        }
    }

    function CloseAuction(_alert, _closeForm, _closeAuctionButton, _orchestrator) {
        this.alert = _alert;
        this.closeForm = _closeForm;
        this.closeAuctionButton = _closeAuctionButton;
        this.orchestrator = _orchestrator;

        this.hidden = function () {
            this.closeForm.style.visibility = "hidden";
        }

        this.checkStatus = function (aucID) {
            let self = this;
            makeCall("GET", "CheckStatusAuction?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let canClose = JSON.parse(req.responseText);
                            if (canClose === 0) {
                                self.hidden();
                                return;
                            }
                            self.registerEvents(aucID);
                        } else if (req.status === 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem('username');
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.registerEvents = function (aucID) {
            this.closeAuctionButton.addEventListener('click', (e) => {
                e.preventDefault();
                let form = e.target.closest("form");
                if (form.checkValidity()) {
                    let self = this;
                    makeCall("POST", "CloseAuction?aucID=" + aucID, form,
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                let message = req.responseText;
                                if (req.status === 200) {
                                    self.orchestrator.refresh();
                                    self.alert.textContent = "";
                                    window.alert("Auction Closed Successfully!");
                                } else if (req.status === 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    self.alert.textContent = message;
                                }
                            }
                        });
                } else {
                    form.reportValidity();
                }
            });
        }
    }


    function ClosedAuctionList(_alert, _id_closedAuction, _id_closedAuctionBody) {
        this.alert = _alert;
        this.closedAuction = _id_closedAuction;
        this.closedAuctionBody = _id_closedAuctionBody;
        this.closedDetails = document.getElementById("id_closedDetails");

        this.reset = function () {
            this.closedDetails.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetClosedAuction", null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let closedAuctionToShow = JSON.parse(req.responseText);
                            closedAuctionList.current_closedAuction = closedAuctionToShow;
                            if (closedAuctionToShow.length === 0) {
                                self.alert.textContent = "No Closed Auction yet!";
                                return;
                            }
                            self.update(closedAuctionToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (closedAuctionList) {
            let row, rowBidder, auctionIDCell, startPriceCell, minUpCell,
                exprDayTimeCell, bidderCell, finalPriceCell, linkCell, anchor;
            this.closedAuctionBody.innerHTML = "";
            let self = this;
            closedAuctionList.forEach(function (auction) {
                row = document.createElement("tr");

                auctionIDCell = document.createElement("td");
                auctionIDCell.textContent = auction.aucID;
                row.appendChild(auctionIDCell);

                startPriceCell = document.createElement("td");
                startPriceCell.textContent = auction.aucPrice + " €";
                row.appendChild(startPriceCell);

                minUpCell = document.createElement("td");
                minUpCell.textContent = auction.minUP + " €";
                row.appendChild(minUpCell);

                exprDayTimeCell = document.createElement("td");
                exprDayTimeCell.textContent = auction.expiryDateTime;
                row.appendChild(exprDayTimeCell);

                bidderCell = document.createElement("td");
                rowBidder = document.createElement("tr");

                let bidderIdCell = document.createElement("td");
                bidderIdCell.textContent = auction.bidder != null ? auction.bidder.id : "";
                rowBidder.appendChild(bidderIdCell);

                let bidderUsernameCell = document.createElement("td");
                bidderUsernameCell.textContent = auction.bidder != null ? auction.bidder.username : "";
                rowBidder.appendChild(bidderUsernameCell);

                let bidderAddressCell = document.createElement("td");
                bidderAddressCell.textContent = auction.bidder != null ? auction.bidder.address : "";
                rowBidder.appendChild(bidderAddressCell);
                row.appendChild(rowBidder);

                finalPriceCell = document.createElement("td");
                finalPriceCell.textContent = auction.maxOffer + " €";
                row.appendChild(finalPriceCell);

                linkCell = document.createElement("td");
                anchor = document.createElement("a");
                linkCell.appendChild(anchor);
                linkText = document.createTextNode("Details");
                anchor.appendChild(linkText);
                anchor.setAttribute('aucID', auction.aucID);
                anchor.addEventListener("click", (e) => {
                    e.preventDefault();
                    OFFautionDetails.show(e.target.getAttribute("aucID"));
                    OFFitemDetails.show(e.target.getAttribute("aucID"));
                    OFFofferDetails.show(e.target.getAttribute("aucID"));
                }, false);
                anchor.href = "#";
                row.appendChild(linkCell);

                self.closedAuctionBody.appendChild(row);
            });
            this.closedAuction.style.visibility = "visible";
        }
    }

    function AuctionDetails(_alert, _id_auctionDetailsContainer, _id_auctionDetailsBody) {
        this.alert = _alert;
        this.auctionDetailsContainer = _id_auctionDetailsContainer;
        this.auctionDetailsBody = _id_auctionDetailsBody;
        this.reset = function () {
            this.auctionDetailsContainer.style.visibility = "hidden";
        }

        this.show = function (aucID) {
            let self = this;
            makeCall("GET", "GetAuctionData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let auctionToShow = JSON.parse(req.responseText);
                            if (auctionToShow.length === 0) {
                                self.alert.textContent = "No Auction available!"
                                return;
                            }
                            self.update(auctionToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (auctionDetails) {
            let row, auctionID, ownerID, startPrice, minRaise, exprDTime, closed;
            this.auctionDetailsBody.innerHTML = "";
            let self = this;
            row = document.createElement("tr");
            auctionID = document.createElement("td");
            auctionID.textContent = auctionDetails.aucID;
            row.appendChild(auctionID);
            ownerID = document.createElement("td");
            ownerID.textContent = auctionDetails.ownerID;
            row.appendChild(ownerID);
            startPrice = document.createElement("td");
            startPrice.textContent = auctionDetails.aucPrice + " €";
            row.appendChild(startPrice);
            minRaise = document.createElement("td");
            minRaise.textContent = auctionDetails.minUP + " €";
            row.appendChild(minRaise);
            exprDTime = document.createElement("td");
            exprDTime.textContent = auctionDetails.expiryDateTime;
            row.appendChild(exprDTime);
            closed = document.createElement("td");
            closed.textContent = auctionDetails.isClosed;
            row.appendChild(closed);
            self.auctionDetailsBody.appendChild(row);
            this.auctionDetailsContainer.style.visibility = "visible";
        }
    }

    function ItemDetails(_alert, _id_itemDetailsContainer, _id_itemDetailsBody) {
        this.alert = _alert;
        this.itemDetailsContainer = _id_itemDetailsContainer;
        this.itemDetailsBody = _id_itemDetailsBody;

        this.reset = function () {
            this.itemDetailsContainer.style.visibility = "hidden";
        }

        this.show = function (aucID) {
            let self = this;
            makeCall("GET", "GetItemData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let itemToShow = JSON.parse(req.responseText);
                            if (itemToShow.length === 0) {
                                self.alert.textContent = "No Item available!"
                                return;
                            }
                            self.update(itemToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (itemDetails) {
            let row, itemID, itemName, itemDescription, itemPrice, itemImage;
            this.itemDetailsBody.innerHTML = "";
            let self = this;
            itemDetails.forEach(function (item) {
                row = document.createElement("tr");
                itemID = document.createElement("td");
                itemID.textContent = item.itemID;
                row.appendChild(itemID);
                itemName = document.createElement("td");
                itemName.textContent = item.itemName;
                row.appendChild(itemName);
                itemDescription = document.createElement("td");
                itemDescription.textContent = item.description;
                row.appendChild(itemDescription);
                itemPrice = document.createElement("td");
                itemPrice.textContent = item.itemPrice + " €";
                row.appendChild(itemPrice);

                itemImage = document.createElement("img");
                itemImage.src = item.imagePath;
                itemImage.style.maxWidth = "200px";
                itemImage.style.maxHeight = "180px";
                row.appendChild(itemImage);

                self.itemDetailsBody.appendChild(row);
            });
            this.itemDetailsContainer.style.visibility = "visible";
        }
    }

    function OfferDetails(_alert, _id_offerDetailsContainer, _id_offerDetailsBody) {
        this.alert = _alert;
        this.offerDetailsContainer = _id_offerDetailsContainer;
        this.offerDetailsBody = _id_offerDetailsBody;
        this.reset = function () {
            this.offerDetailsContainer.style.visibility = "hidden";
        }

        this.show = function (aucID) {
            var self = this;
            makeCall("GET", "GetOfferData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let offerToShow = JSON.parse(req.responseText);
                            if (offerToShow.length === 0) {
                                self.alert.textContent = "No Offer available!"
                                return;
                            }
                            self.update(offerToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (offerDetails) {
            let row, userName, offerAmount, offerDate;
            this.offerDetailsBody.innerHTML = "";
            let self = this;
            row = document.createElement("tr");
            offerDetails.forEach(function (offer) {
                row = document.createElement("tr");
                userName = document.createElement("td");
                userName.textContent = offer.userName;
                row.appendChild(userName);
                offerAmount = document.createElement("td");
                offerAmount.textContent = offer.offerPrice + " €";
                row.appendChild(offerAmount);
                offerDate = document.createElement("td");
                offerDate.textContent = offer.offerDayTime;
                row.appendChild(offerDate);

                self.offerDetailsBody.appendChild(row);
            });
            this.offerDetailsContainer.style.visibility = "visible";
        }
    }

    function AvailableItemList(_alert, _id_availableItemListContainer, _id_availableItemListBody) {
        this.alert = _alert;
        this.availableItemListContainer = _id_availableItemListContainer;
        this.availableItemListBody = _id_availableItemListBody;

        this.reset = function () {
            this.availableItemListContainer.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetAvailableItem", null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let availableToShow = JSON.parse(req.responseText);
                            if (availableToShow.length === 0) {
                                self.alert.textContent = "No Item available!"
                                return;
                            }
                            self.update(availableToShow);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                });
        };

        this.update = function (availableItemList) {
            let row, itemID, itemName, itemDescription, itemPrice, itemImage, checkboxCell, checkbox;
            this.availableItemListBody.innerHTML = "";
            let self = this;
            availableItemList.forEach(function (item) {
                row = document.createElement("tr");
                itemID = document.createElement("td");
                itemID.textContent = item.itemID;
                row.appendChild(itemID);
                itemName = document.createElement("td");
                itemName.textContent = item.itemName;
                row.appendChild(itemName);
                itemDescription = document.createElement("td");
                itemDescription.textContent = item.description;
                row.appendChild(itemDescription);
                itemPrice = document.createElement("td");
                itemPrice.textContent = item.itemPrice + " €";
                row.appendChild(itemPrice);

                itemImage = document.createElement("img");
                itemImage.src = item.imagePath;
                itemImage.style.maxWidth = "200px";
                itemImage.style.maxHeight = "180px";
                row.appendChild(itemImage);

                checkboxCell = document.createElement("td");
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "selectedItems";
                checkbox.value = item.itemID;
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);


                self.availableItemListBody.appendChild(row);
            });

            this.availableItemListContainer.style.visibility = "visible";
        }
    }

    function PageOrchestrator() {
        let alertContainer = document.getElementById("id_alert");

        this.start = function () {
            personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
            personalMessage.show();

            openAuctionList = new OpenAuctionList(
                alertContainer,
                document.getElementById("id_myOpenAuctionsContainer"),
                document.getElementById("id_myOpenAuctionsBody")
            );

            closedAuctionList = new ClosedAuctionList(
                alertContainer,
                document.getElementById("id_myClosedAuctionsContainer"),
                document.getElementById("id_myClosedAuctionsBody")
            );

            availableItemList = new AvailableItemList(
                alertContainer,
                document.getElementById("id_availableItemListContainer"),
                document.getElementById("id_availableItemListBody")
            );

            closeAuction = new CloseAuction(
                alertContainer,
                document.getElementById("id_closeForm"),
                document.getElementById("id_closeAuctionButton"),
                this
            );

            ONautionDetails = new AuctionDetails(
                alertContainer,
                document.getElementById("id_ONauctionDetailsContainer"),
                document.getElementById("id_ONauctionDetailsBody")
            );

            ONitemDetails = new ItemDetails(
                alertContainer,
                document.getElementById("id_ONitemDetailsContainer"),
                document.getElementById("id_ONitemDetailsBody")
            );

            ONofferDetails = new OfferDetails(
                alertContainer,
                document.getElementById("id_ONoffersDetailsContainer"),
                document.getElementById("id_ONoffersDetailsBody")
            );

            OFFautionDetails = new AuctionDetails(
                alertContainer,
                document.getElementById("id_OFFauctionDetailsContainer"),
                document.getElementById("id_OFFauctionDetailsBody")
            );

            OFFitemDetails = new ItemDetails(
                alertContainer,
                document.getElementById("id_OFFitemDetailsContainer"),
                document.getElementById("id_OFFitemDetailsBody")
            );

            OFFofferDetails = new OfferDetails(
                alertContainer,
                document.getElementById("id_OFFoffersDetailsContainer"),
                document.getElementById("id_OFFoffersDetailsBody")
            );

            createNewItem = new CreateNewItem(
                alertContainer,
                document.getElementById("id_createItemForm")
            );
            createNewItem.registerEvents(this);

            createNewAuction = new CreateNewAuction(
                alertContainer,
                document.getElementById("id_createAuctionForm")
            );
            createNewAuction.registerEvents(this);
        };

        this.refresh = function () {
            alertContainer.textContent = "";
            openAuctionList.show();
            openAuctionList.reset();
            closedAuctionList.show();
            closedAuctionList.reset();
            availableItemList.show();
            createNewAuction.reset();
            closeAuction.hidden();
        }
    }

}