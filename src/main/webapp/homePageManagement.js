{
    // page components
    // Main controller
    let pageOrchestrator = new PageOrchestrator();
    let personalMessage;

    // HOME PAGE components: nave bar
    let sellButton = document.getElementById('id_sellButton');
    let buyButton = document.getElementById('id_buyButton');

    // SELL PAGE components
    let createNewItem, openAuctionList, closedAuctionList, ONautionDetails, ONitemDetails,
        ONofferDetails, OFFautionDetails, OFFitemDetails, OFFofferDetails, createNewAuction,
        availableItemList, closeAuction;
    let sellBlock = document.getElementById('id_sellBlock');

    // BUY PAGE components
    let keyAucList, offerList, wonAuctionList, itemDetailsList, currentAuctionID;
    let searchKeywordForm = document.getElementById('id_getKeyAuctionForm');
    let keywordInput = document.getElementById('id_keyword');
    let giveOfferForm = document.getElementById('id_giveOfferForm');
    let buyBlock = document.getElementById('id_buyBlock');
    let stillOpenAuctionList = document.getElementById('id_stillOpenAuctionBlock');


    // COOKIE components
    let user = sessionStorage.getItem('username');
    user = user.replace(/\r?\n|\r/g, '');   // remove the \n or \r for the username

    window.addEventListener("load", () => {
        if (sessionStorage.getItem("username") == null) {
            window.location.href = "index.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();

            // -------------------------COOKIE-------------------------
            let isNewUser = getCookie('isNewUser');

            if (isNewUser === 'true') {
                // User is a new user show the BUY  component
                buyBlock.style.display = 'block';
                sellBlock.style.display = 'none';
                buyButton.style.borderBottom = "3px solid #b4a078";
                buyButton.style.color = "#b4a078";
                sellButton.style.borderBottom = "none";
                sellButton.style.color = "#333333";
            } else {

                const pageToShow = determinePageToShow();
                // Determine which page to show
                if (pageToShow === 'NOTCREATEAUCTION') {
                    // User is not a new user  show the Buy component only showing all those auctions that user clicked
                    // and still with status open initialize the still open auction list sending the clicked auctions to
                    // the servlet
                    sendClickedAuctionsToServlet();
                    sellBlock.style.display = 'none';
                    buyBlock.style.display = 'block';
                    buyButton.style.borderBottom = "3px solid #b4a078";
                    buyButton.style.color = "#b4a078";
                    sellButton.style.borderBottom = "none";
                    sellButton.style.color = "#333333";
                } else if (pageToShow === 'CREATEAUCTION') {
                    // otherwise show the SELL  component if last action was create auction
                    buyBlock.style.display = 'none';
                    sellBlock.style.display = 'block';
                    sellButton.style.borderBottom = "3px solid #b4a078";
                    sellButton.style.color = "#b4a078";
                    buyButton.style.borderBottom = "none";
                    buyButton.style.color = "#333333";
                }
            }
        }
    }, false);

    // Show the user's name
    function PersonalMessage(_username, _messageContainer) {
        this.username = _username;
        this.show = function () {
            _messageContainer.textContent = this.username;
        }
    }

    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ COOKIES MANAGEMENT COMPONENT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    function setCookie(cookieName, cookieValue, daysToExpire) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        const expirationUTCString = expirationDate.toUTCString();
        document.cookie = `${cookieName}=${cookieValue}; expires=${expirationUTCString}; path=/`;
    }

    function getCookie(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

    // Set user's last action cookie
    function setLastAction(action) {
        const lastActionCookieName = 'LastAction_' + user;
        setCookie(lastActionCookieName, action, 30);
    }

    // Get user's last action cookie
    function getLastAction() {
        const lastActionCookieName = 'LastAction_' + user;
        return getCookie(lastActionCookieName);
    }

    // Recording the clicked auctions
    function recordClickedAuction(auctionId) {
        const clickedAuctions = getCookie('clickedAuctions_' + user);
        if (clickedAuctions) {
            // 如果已存在 clickedAuctions cookie，则将新的 Auction ID 添加到其中
            const updatedAuctions = clickedAuctions + ',' + auctionId;
            setCookie('clickedAuctions_' + user, updatedAuctions, 30);
        } else {
            // 如果 clickedAuctions cookie 不存在，则创建新的 cookie
            setCookie('clickedAuctions_' + user, auctionId, 30);
        }
    }


    /**
     * Used for checking if this aucID is already clicked
     * only save the clicked auction ID in the cookie with this method could avoid the duplication of the clicked auction ID
     * @param auctionId
     * @returns {boolean}
     */
    function isAuctionClicked(auctionId) {
        const clickedAuctions = getCookie('clickedAuctions_' + user);
        if (clickedAuctions) {
            const auctionsArray = clickedAuctions.split(',');
            return auctionsArray.includes(auctionId.toString());
        }
        return false;
    }

    /**
     * Used for sending the clicked auction ID to the servlet will return the still open auction list
     * will automatically update the still open auction list
     * @returns {boolean}
     */
    function sendClickedAuctionsToServlet() {
        const clickedAuctions = getCookie('clickedAuctions_' + user);
        if (clickedAuctions) {
            const idArray = clickedAuctions.split(',');
            let jsonString = JSON.stringify(idArray);
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE) {
                    const message = req.responseText;
                    if (req.status === 200) {
                        stillOpenAuctionList.update(JSON.parse(message));
                    }
                }
            };

            req.open('POST', 'GetStillOpenAucData');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(jsonString);
        }
        return false; //if there are no clicked auctions, return false
    }


    /**
     * Function used for determining which page to show
     * */
    function determinePageToShow() {
        let action = getCookie("LastAction_" + user);
        if (action === 'createauction') {
            return 'CREATEAUCTION';
        } else {
            return 'NOTCREATEAUCTION';
        }
    }


    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SELL PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    function CreateNewItem() {
        this.createItemButton = document.getElementById("id_newItemButton");
        this.registerEvents = function (orchestrator) {
            this.createItemButton.addEventListener('click', (e) => {
                let form = e.target.closest("form");
                if (form.checkValidity()) {
                    e.preventDefault();
                    makeCall("POST", 'CreateNewItem', form,
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                let message = req.responseText;
                                if (req.status === 200) {
                                    availableItemList.show()
                                    //orchestrator.refresh();
                                    window.alert("Item Created Successfully!");
                                    setLastAction("createitem");
                                } else if (req.status === 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    window.alert(message);
                                }
                            }
                        });
                } else {
                    form.reportValidity();
                }
            });
        };
    }

    function CreateNewAuction(_id_createNewAuction) {
        this.createNewAuction = _id_createNewAuction;
        this.createAuctionButton = document.getElementById("id_newAuctionButton");
        this.dateInput = document.getElementById("id_expiryDateTime");

        let now = new Date();
        let year = now.getFullYear();
        let month = ("0" + (now.getMonth() + 1)).slice(-2);
        let day = ("0" + now.getDate()).slice(-2);
        let hour = ("0" + now.getHours()).slice(-2);
        let minute = ("0" + now.getMinutes()).slice(-2);

        this.dateInput.setAttribute("min", year + "-" + month + "-" + day + "T" + hour + ":" + minute);

        this.registerEvents = function (orchestrator) {
            Array.from(this.createNewAuction.querySelectorAll("input[type='button'].next, input[type='button'].prev")).forEach(b => {
                b.addEventListener("click", (e) => {
                    e.preventDefault();
                    let eventFieldset = e.target.closest("fieldset"), valid = true;
                    if (e.target.className === "next") {
                        // Check if at least one item is selected
                        // If not, prevent the user from going to the next step
                        let checkboxes = document.querySelectorAll("input[type='checkbox']");
                        let checked = false;
                        for (let i = 0; i < checkboxes.length; i++) {
                            if (checkboxes[i].checked) {
                                checked = true;
                                break;
                            }
                        }
                        if (!checked) {
                            e.preventDefault();
                            window.alert("You must select at least one item!");
                            valid = false;
                        } else {
                            for (let i = 0; i < eventFieldset.elements.length; i++) {
                                if (!eventFieldset.elements[i].checkValidity()) {
                                    eventFieldset.elements[i].reportValidity();
                                    valid = false;
                                    break;
                                }
                            }
                        }

                    }
                    // If the form is valid, go to the next step
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
                                    openAuctionList.show();
                                    openAuctionList.reset();
                                    availableItemList.show();
                                    // orchestrator.refresh();
                                    window.alert("Auction Created Successfully!");
                                    setLastAction("createauction");
                                } else if (req.status === 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    window.alert(message);
                                    self.reset();
                                }
                            }
                        });
                } else {
                    eventFieldset.reportValidity();
                }
            });

            this.createNewAuction.querySelector("input[type='button'].cancel").addEventListener('click', (e) => {
                e.target.closest('form').reset();
                this.reset();
            });
        };

        // Reset the form to the first step
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

    /**
     * Show the list of open auctions created by the user
     * @param _id_openAuction the id of the div containing the list of open auctions
     * @param _id_openAuctionBody the id of the div containing the body of the open auction
     * */
    function OpenAuctionList(_id_openAuction, _id_openAuctionBody) {
        this.openAuction = _id_openAuction;
        this.openAuctionBody = _id_openAuctionBody;

        this.reset = function () {
            ONautionDetails.reset();
            ONitemDetails.reset();
            ONofferDetails.reset();
            document.getElementById("id_ONtextListItem").style.display = "none";    // title List of Items
            document.getElementById("id_ONtextListOffer").style.display = "none";   // title List of Offers
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
                            self.update(openAuctionToShow);
                        } else {
                            window.alert(message);
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
                    itemsCell.appendChild(rowItem);
                });
                row.appendChild(itemsCell);
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

                    let currentONAuctionID = e.target.getAttribute("aucID");
                    // Adding Auction ID into Cookies and checking if it is already clicked
                    isAuctionClicked(currentONAuctionID);
                    if (!isAuctionClicked(currentONAuctionID)) {
                        recordClickedAuction(currentONAuctionID);
                    }
                }, false);
                anchor.href = "#";
                row.appendChild(linkCell);
                self.openAuctionBody.appendChild(row);
            });
            this.openAuction.style.display = "block";
        }
    }

    /**
     * Alert the user if the auction can be closed
     * @param _closeForm the id of the div containing the list of closed auctions
     * @param _closeAuctionButton the id of the div containing the body of the closed auction
     * @param _orchestrator the orchestrator
     * */
    function CloseAuction(_closeForm, _closeAuctionButton, _orchestrator) {
        this.closeForm = _closeForm;
        this.closeAuctionButton = _closeAuctionButton;
        this.orchestrator = _orchestrator;

        this.hidden = function () {
            this.closeForm.style.display = "none";
        }

        this.checkStatus = function (aucID) {
            let self = this;
            makeCall("GET", "CheckStatusAuction?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let canClose = JSON.parse(req.responseText);
                            if (canClose === false) {
                                self.hidden();
                                return;
                            }
                            self.closeForm.style.display = "block";
                            self.registerEvents(aucID);
                        } else if (req.status === 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem('username');
                        } else {
                            window.alert(message);
                        }
                    }
                });
        };

        // If the auction can be closed, the user can click on the button to close it
        // The auction is closed and the component is refreshed
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
                                    openAuctionList.show();
                                    openAuctionList.reset();
                                    availableItemList.show();
                                    closedAuctionList.show();
                                    closedAuctionList.reset();
                                    // self.orchestrator.refresh();
                                    window.alert("Auction Closed Successfully!");
                                    setLastAction("closeauction");
                                } else if (req.status === 403) {
                                    window.location.href = req.getResponseHeader("Location");
                                    window.sessionStorage.removeItem('username');
                                } else {
                                    window.alert(message);
                                }
                            }
                        });
                } else {
                    form.reportValidity();
                }
            });
        }
    }


    /**
     * Show the list of closed auctions
     * @param _id_closedAuction the id of the div containing the list of closed auctions
     * @param _id_closedAuctionBody the id of the div containing the body of the closed auction
     * */
    function ClosedAuctionList(_id_closedAuction, _id_closedAuctionBody) {
        this.closedAuction = _id_closedAuction;
        this.closedAuctionBody = _id_closedAuctionBody;

        this.reset = function () {
            OFFautionDetails.reset();
            OFFitemDetails.reset();
            OFFofferDetails.reset();
            document.getElementById("id_OFFtextListItem").style.display = "none";
            document.getElementById("id_OFFtextListOffer").style.display = "none";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetClosedAuction", null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let closedAuctionToShow = JSON.parse(req.responseText);
                            self.update(closedAuctionToShow);
                        } else {
                            window.alert(message);
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
            this.closedAuction.style.display = "block";
        }
    }

    /**
     * Show the details of a closed auction or a open auction
     * @param _id_auctionDetailsContainer the id of the div containing the details of the auction
     * @param _id_auctionDetailsBody the id of the div containing the body of the auction
     * @param _id_textListItem the id of the div containing the details of the auction
     * @param _id_textListOffer the id of the div containing the details of the auction
     * */
    function AuctionDetails(_id_auctionDetailsContainer, _id_auctionDetailsBody, _id_textListItem, _id_textListOffer) {
        this.auctionDetailsContainer = _id_auctionDetailsContainer;
        this.auctionDetailsBody = _id_auctionDetailsBody;
        this.textListItem = _id_textListItem;
        this.textListOffer = _id_textListOffer;
        this.reset = function () {
            this.auctionDetailsContainer.style.display = "none";
        }

        this.show = function (aucID) {
            let self = this;
            makeCall("GET", "GetAuctionData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let auctionToShow = JSON.parse(req.responseText);
                            self.textListItem.style.display = "block";
                            self.textListOffer.style.display = "block";
                            self.update(auctionToShow);
                        } else {
                            window.alert(message);
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
            this.auctionDetailsContainer.style.display = "block";
        }
    }

    /**
     * Show the details of a closed auction or a open auction
     * @param _id_itemDetailsContainer the id of the div containing the details of the auction
     * @param _id_itemDetailsBody the id of the div containing the body of the auction
     * */
    function ItemDetails(_id_itemDetailsContainer, _id_itemDetailsBody) {
        this.itemDetailsContainer = _id_itemDetailsContainer;
        this.itemDetailsBody = _id_itemDetailsBody;

        this.reset = function () {
            this.itemDetailsContainer.style.display = "none";
        }

        this.show = function (aucID) {
            let self = this;
            makeCall("GET", "GetItemData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let itemToShow = JSON.parse(req.responseText);
                            self.update(itemToShow);
                        } else {
                            window.alert(message);
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
            this.itemDetailsContainer.style.display = "block";
        }
    }

    /**
     * Show the details of a closed auction or a open auction
     * @param _id_offerDetailsContainer the id of the div containing the details of the auction
     * @param _id_offerDetailsBody the id of the div containing the body of the auction
     * */
    function OfferDetails(_id_offerDetailsContainer, _id_offerDetailsBody) {
        this.offerDetailsContainer = _id_offerDetailsContainer;
        this.offerDetailsBody = _id_offerDetailsBody;
        this.reset = function () {
            this.offerDetailsContainer.style.display = "none";
        }

        this.show = function (aucID) {
            var self = this;
            makeCall("GET", "GetOfferData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            let offerToShow = JSON.parse(req.responseText);
                            self.update(offerToShow);
                        } else {
                            window.alert(message);
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
            this.offerDetailsContainer.style.display = "block";
        }
    }

    /**
     * Show the available item list to the user for the creation of a new auction
     * @param _id_availableItemListContainer the id of the div containing the available item list
     * @param _id_availableItemListBody the id of the div containing the body of the available item list
     * */
    function AvailableItemList(_id_availableItemListContainer, _id_availableItemListBody) {
        this.availableItemListContainer = _id_availableItemListContainer;
        this.availableItemListBody = _id_availableItemListBody;

        this.reset = function () {
            this.availableItemListContainer.style.display = "none";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetAvailableItem", null,
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        if (req.status === 200) {
                            let availableToShow = JSON.parse(req.responseText);
                            self.update(availableToShow);
                        } else {
                            window.alert(message);
                        }
                    }
                });
        };

        this.update = function (availableItemList) {
            let row, itemID, itemName, itemDescription, itemPrice, itemImage, checkboxCell, checkbox;
            this.availableItemListBody.innerHTML = "";
            let self = this;
            let nextButton = document.getElementsByName("next");
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

            this.availableItemListContainer.style.display = "block";
        }
    }

    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ BUY PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    //KeyAuctionList VIEW COMPONENT
    /**
     * Show the list of keyAuctions which contains the item that has the keyword (name or description)
     * @param container the div containing the list of keyAuction
     * @param listcontainer the div containing the body of the list of keyAuction
     * */
    function KeyAuctionList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;

        this.show = function (keyword) {
            let self = this;
            let urlToCall = "GetKeyAuctionList?keyword=" + keyword;
            makeCall("GET", urlToCall, null, function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let keyAucToShow = JSON.parse(req.responseText);
                        if (keyAucToShow.length === 0) {
                            window.alert("No keyAuction yet!");
                            return;
                        }

                        self.update(keyAucToShow);
                        self.listcontainer.style.display = "block";
                    } else {
                        window.alert("No keyAuction found!");
                    }
                }
            })
        }
        this.update = function (arrayAuctions) {
            let row, auctionIdCell, ownerCell, priceCell, minUpCell, timeRemainingCell, statusCell,
                linkCell, linktext, anchor;
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
                priceCell.textContent = auction.aucPrice + "€";
                row.appendChild(priceCell);
                minUpCell = document.createElement("td");
                minUpCell.textContent = auction.minUP + "€";
                row.appendChild(minUpCell);
                // endDateCell = document.createElement("td");
                // endDateCell.textContent = auction.expiryDateTime;
                // row.appendChild(endDateCell);
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
                statusCell = document.createElement("td");
                statusCell.textContent = auction.isClosed;
                row.appendChild(statusCell);

                linkCell = document.createElement("td");
                anchor = document.createElement("a");
                linkCell.appendChild(anchor);
                linktext = document.createTextNode("Details");
                anchor.appendChild(linktext);
                anchor.setAttribute("keyAucID", auction.aucID);
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    giveOfferForm.style.display = "block";
                    currentAuctionID = e.target.getAttribute("keyAucID");

                    //adding Auction ID into Cookies
                    isAuctionClicked(currentAuctionID);
                    if (!isAuctionClicked(currentAuctionID)) {
                        recordClickedAuction(currentAuctionID);
                    }

                    let auctionID = e.target.getAttribute("keyAucID");
                    let urlToCall = "GetOfferData?aucID=" + auctionID;

                    //after clicking on the details shows the details of items and wonAuction of user
                    wonAuctionList.show();
                    itemDetailsList.show(auctionID);
                    offerList.show(auctionID);
                    makeCall("GET", urlToCall, null, function (req) {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                let offerToShow = JSON.parse(req.responseText);
                                offerList.update(offerToShow);
                            } else {
                                window.alert(req.responseText);
                            }
                        }
                    });


                }, false);

                linkCell.appendChild(anchor);
                anchor.href = '#';
                row.appendChild(linkCell);
                self.listcontainerbody.appendChild(row);
            });
        }
        this.reset = function () {
            this.listcontainer.style.display = "none";
        }
    }

    //OffernList VIEW COMPONENT
    /**
     * Show the list of offers of the auction
     * @param container the div containing the list of offers
     * @param listcontainer the div containing the body of the list of offers
     * */
    function OfferList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;

        this.show = function (aucID) {
            let self = this;
            let urlToCall = "GetOfferData?aucID=" + aucID;
            makeCall("GET", urlToCall, null, function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let offerToShow = JSON.parse(req.responseText);
                        self.listcontainer.style.display = "block";
                        self.update(offerToShow);
                        ONofferDetails.update(offerToShow);

                    } else {
                        window.alert(req.responseText);
                    }
                }
            })
        }
        this.update = function (arrayOffers) {
            let row, offerIdCell, userIdCell, aucIdCell, offerCell, offerDateCell;

            this.listcontainerbody.innerHTML = "";
            let self = this;
            arrayOffers.forEach(function (offer) {
                row = document.createElement("tr");
                offerIdCell = document.createElement("td");
                offerIdCell.textContent = offer.offerID;
                row.appendChild(offerIdCell);
                userIdCell = document.createElement("td");
                userIdCell.textContent = offer.userName;
                row.appendChild(userIdCell);
                aucIdCell = document.createElement("td");
                aucIdCell.textContent = offer.aucID;
                row.appendChild(aucIdCell);
                offerCell = document.createElement("td");
                offerCell.textContent = offer.offerPrice + "€";
                row.appendChild(offerCell);
                offerDateCell = document.createElement("td");
                offerDateCell.textContent = offer.offerDayTime;
                row.appendChild(offerDateCell);
                self.listcontainerbody.appendChild(row);

            });

        }

        this.reset = function () {
            this.listcontainer.style.display = "none";
        }
    }

    //WonAuctionList VIEW COMPONENT
    /**
     * Show the list of won auctions of the user
     * @param container the div containing the list of won auctions
     * @param listcontainer the div containing the body of the list of won auctions
     * */
    function WonAuctionList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset = function () {
            this.listcontainer.style.display = "none";
        }

        this.show = function () {
            let self = this;

            let urlToCall = "GetWonAuctionData";
            makeCall("GET", urlToCall, null, function (req) {

                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let wonAucToShow = JSON.parse(req.responseText);
                        self.listcontainer.style.display = "block";
                        self.update(wonAucToShow);

                    } else {
                        window.alert(req.responseText);
                    }
                }
            })
        }


        this.update = function (wonAucToShow) {
            let row, rowItem, auctionIDCell, itemsCell, auctionPriceCell, finalPriceCell, endDateCell;
            this.listcontainerbody.innerHTML = "";
            let self = this;

            wonAucToShow.forEach(function (auction) {
                row = document.createElement("tr");

                auctionIDCell = document.createElement("td");
                auctionIDCell.textContent = auction.aucID;
                row.appendChild(auctionIDCell);

                itemsCell = document.createElement("td");
                auction.aucItems.forEach(function (item) {
                    rowItem = document.createElement("tr");

                    let itemIDCell = document.createElement("td");
                    itemIDCell.textContent = item.itemName;
                    rowItem.appendChild(itemIDCell);

                    let itemNameCell = document.createElement("td");
                    itemNameCell.textContent = item.itemPrice + "€";
                    rowItem.appendChild(itemNameCell);

                    itemsCell.appendChild(rowItem);
                });
                row.appendChild(itemsCell);

                auctionPriceCell = document.createElement("td");
                auctionPriceCell.textContent = auction.aucPrice + "€";
                row.appendChild(auctionPriceCell);

                finalPriceCell = document.createElement("td");
                finalPriceCell.textContent = auction.winningBid + "€";
                row.appendChild(finalPriceCell);

                endDateCell = document.createElement("td");
                endDateCell.textContent = auction.expiryDateTime;
                row.appendChild(endDateCell);

                self.listcontainerbody.appendChild(row);
            });
        };

        this.reset = function () {
            this.listcontainer.style.display = "none";
        }
    }

    //Item Details Of Auction VIEW COMPONENT
    /**
     * Show the list of items of the auction
     * @param container the div containing the list of items
     * @param listcontainer the div containing the body of the list of items
     * */
    function ItemDetailList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.itemDetailAuc = document.getElementById("id_itemDetailAuc");

        this.show = function (aucID) {
            let self = this;
            let urlToCall = "GetItemData?aucID=" + aucID;
            makeCall("GET", urlToCall, null, function (req) {
                if (req.readyState === XMLHttpRequest.DONE) {
                    let message = req.responseText;
                    if (req.status === 200) {
                        let itemToShow = JSON.parse(req.responseText);
                        self.listcontainer.style.display = "block";
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
                this.itemDetailAuc.textContent = "Auction ID: " + aucID;

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
                    itemPriceCell.textContent = item.itemPrice + "€";

                    // create<img>TAG，and setting src URL
                    let img = document.createElement("img");
                    img.src = item.imagePath;
                    img.style.maxWidth = "200px";
                    img.style.maxHeight = "180px";
                    itemImageCell.appendChild(img);

                });
            }
        }
        this.reset = function () {
            this.listcontainer.style.display = "none";
        }
    }


    //StillOpenAuctionList VIEW COMPONENT
    /**
     * Show the list of auction clicked by the user last time
     * @param container the div containing the list of clicked auctions
     * @param listcontainer the div containing the body of the list of clicked auctions
     * */
    function StillOpenAuctionList(container, listcontainer) {
        let self = this;
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset = function () {
            this.listcontainer.style.display = "none";
        }

        this.update = function (stillOpenAucToShow) {
            let row, auctionIdCell, ownerCell, priceCell, minUpCell, timeRemainingCell, statusCell,
                linkCell, linktext, anchor;

            this.listcontainerbody.innerHTML = "";
            this.listcontainer.style.display = "block";

            //build updated list of auctions
            let self = this;
            stillOpenAucToShow.forEach(function (auction) {
                row = document.createElement("tr");
                auctionIdCell = document.createElement("td");
                auctionIdCell.textContent = auction.aucID;
                row.appendChild(auctionIdCell);
                ownerCell = document.createElement("td");
                ownerCell.textContent = auction.ownerID;
                row.appendChild(ownerCell);
                priceCell = document.createElement("td");
                priceCell.textContent = auction.aucPrice + "€";
                row.appendChild(priceCell);
                minUpCell = document.createElement("td");
                minUpCell.textContent = auction.minUP + "€";
                row.appendChild(minUpCell);
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
                statusCell = document.createElement("td");
                statusCell.textContent = auction.isClosed;
                row.appendChild(statusCell);


                linkCell = document.createElement("td");
                anchor = document.createElement("a");
                linkCell.appendChild(anchor);
                linktext = document.createTextNode("Details");
                anchor.appendChild(linktext);
                anchor.setAttribute("stillOpenAucID", auction.aucID);
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    currentAuctionID = e.target.getAttribute("stillOpenAucID");

                    //adding Auction ID into Cookies //
                    if (!isAuctionClicked(currentAuctionID)) {
                        recordClickedAuction(currentAuctionID);
                    }
                    //sendClickedAuctionsToServlet();

                    let auctionID = e.target.getAttribute("stillOpenAucID");
                    let urlToCall = "GetOfferData?aucID=" + auctionID;

                    //after clicking on the details shows the details of items and wonAuction of user
                    giveOfferForm.style.display = "block";
                    wonAuctionList.show();
                    itemDetailsList.show(auctionID);
                    offerList.show(auctionID);
                    makeCall("GET", urlToCall, null, function (req) {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                let offerToShow = JSON.parse(req.responseText);
                                offerList.update(offerToShow);
                                // offerContainer.classList.remove("hidden");
                            } else {
                                window.alert(req.responseText);
                            }
                        }
                    });
                }, false);

                linkCell.appendChild(anchor);
                anchor.href = '#';
                row.appendChild(linkCell);
                self.listcontainerbody.appendChild(row);
            });
        }
    }


    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Listener ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    sellButton.addEventListener("click", function (e) {
        e.preventDefault();
        pageOrchestrator.refresh();
        document.getElementById("id_buyBlock").style.display = "none";
        document.getElementById("id_sellBlock").style.display = "block";
        sellButton.style.borderBottom = "3px solid #b4a078";
        sellButton.style.color = "#b4a078";
        buyButton.style.borderBottom = "none";
        buyButton.style.color = "#333333";
    }, false);

    buyButton.addEventListener("click", function (e) {
        e.preventDefault();
        pageOrchestrator.refresh();
        document.getElementById("id_sellBlock").style.display = "none";
        document.getElementById("id_buyBlock").style.display = "block";
        buyButton.style.borderBottom = "3px solid #b4a078";
        buyButton.style.color = "#b4a078";
        sellButton.style.borderBottom = "none";
        sellButton.style.color = "#333333";
    }, false);

    searchKeywordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let keyword = keywordInput.value;
        setLastAction('searchKeyword');
        keyAucList.show(keyword);
        offerList.reset();
        itemDetailsList.reset();
        giveOfferForm.style.display = "none";
    }, false);

    giveOfferForm.addEventListener("submit", function (e) {
        let form = e.target.closest("form");
        e.preventDefault();
        if (form.checkValidity()) {
            let input = form.querySelector("input[type='number']").value;
            let url = "CreateOffer?auctionID=" + currentAuctionID + "&offer=" + input;
            let tempAucID = currentAuctionID;
            //set cookies of LastAction
            setLastAction('giveOffer');

            makeCall("GET", url, null, function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let newOffer = JSON.parse(req.responseText);
                        offerList.show(tempAucID);
                    } else if (req.status === 400) {
                        let errorMessage = req.responseText;
                        window.alert(errorMessage);
                    } else {
                        let errorMessage = "What a miser! Give a little more!";
                        window.alert(errorMessage);
                    }
                }
            }, false);
        } else {
            form.reportValidity();
        }
    }, false);


    function PageOrchestrator() {
        this.start = function () {
            personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
            personalMessage.show();

            // -------------------------SELL PAGE ELEMENTS-------------------------
            openAuctionList = new OpenAuctionList(
                document.getElementById("id_myOpenAuctionsContainer"),
                document.getElementById("id_myOpenAuctionsBody")
            );

            closedAuctionList = new ClosedAuctionList(
                document.getElementById("id_myClosedAuctionsContainer"),
                document.getElementById("id_myClosedAuctionsBody")
            );

            availableItemList = new AvailableItemList(
                document.getElementById("id_availableItemListContainer"),
                document.getElementById("id_availableItemListBody")
            );

            closeAuction = new CloseAuction(
                document.getElementById("id_closeForm"),
                document.getElementById("id_closeAuctionButton"),
                this
            );

            ONautionDetails = new AuctionDetails(
                document.getElementById("id_ONauctionDetailsContainer"),
                document.getElementById("id_ONauctionDetailsBody"),
                document.getElementById("id_ONtextListItem"),
                document.getElementById("id_ONtextListOffer")
            );

            ONitemDetails = new ItemDetails(
                document.getElementById("id_ONitemDetailsContainer"),
                document.getElementById("id_ONitemDetailsBody")
            );

            ONofferDetails = new OfferDetails(
                document.getElementById("id_ONoffersDetailsContainer"),
                document.getElementById("id_ONoffersDetailsBody")
            );

            OFFautionDetails = new AuctionDetails(
                document.getElementById("id_OFFauctionDetailsContainer"),
                document.getElementById("id_OFFauctionDetailsBody"),
                document.getElementById("id_OFFtextListItem"),
                document.getElementById("id_OFFtextListOffer")
            );

            OFFitemDetails = new ItemDetails(
                document.getElementById("id_OFFitemDetailsContainer"),
                document.getElementById("id_OFFitemDetailsBody")
            );

            OFFofferDetails = new OfferDetails(
                document.getElementById("id_OFFoffersDetailsContainer"),
                document.getElementById("id_OFFoffersDetailsBody")
            );

            createNewItem = new CreateNewItem();
            createNewItem.registerEvents(this);

            createNewAuction = new CreateNewAuction(
                document.getElementById("id_createAuctionForm")
            );
            createNewAuction.registerEvents(this);

            // -------------------------BUY PAGE ELEMENTS-------------------------
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
            itemDetailsList = new ItemDetailList(
                document.getElementById("id_itemlistContainer"),
                document.getElementById("id_itemlistContainerBody")
            )
            stillOpenAuctionList = new StillOpenAuctionList(
                document.getElementById("id_stillOpenAuctionBlock"),
                document.getElementById("id_stillOpenAuctionBlockBody")
            );

        };

        this.refresh = function () {
            openAuctionList.show();
            openAuctionList.reset();
            availableItemList.show();
            closedAuctionList.show();
            closedAuctionList.reset();
            createNewAuction.reset();
            closeAuction.hidden();
            keyAucList.reset();
            offerList.reset();
            wonAuctionList.show();
            itemDetailsList.reset();
            giveOfferForm.style.display = "none";
        }
    }
}