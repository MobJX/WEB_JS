{
    // page components
    let pageOrchestrator = new PageOrchestrator();
    let personalMessage;

    // SELL PAGE components
    let createNewItem, openAuctionList, closedAuctionList, ONautionDetails, ONitemDetails,
        ONofferDetails, OFFautionDetails, OFFitemDetails, OFFofferDetails, createNewAuction,
        availableItemList, closeAuction;

    // BUY PAGE components
    let keyAucList, offerList, wonAuctionList, itemDetailsList, currentAuctionID, stillOpenAuctionList;

    let searchKeywordForm = document.getElementById('id_getKeyAuctionForm');
    let keywordInput = document.getElementById('id_keyword');
    let giveOfferForm = document.getElementById('id_giveOfferForm');
    let alertContainer = document.getElementById('id_alert');
    let buyBlock = document.getElementById('id_buyBlock');
    let sellBlock = document.getElementById('id_sellBlock');
    let stillOpenAuctionBlock = document.getElementById('id_stillOpenAuctionBlock');

    // COOKIE components
    let user = sessionStorage.getItem('username');
    user = user.replace(/\r?\n|\r/g, '');

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

    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ COOKIES MANAGEMENT COMPONENT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    //
    // 设置 Cookie
//     function setCookie(cookieName, cookieValue, daysToExpire) {
//         const expirationDate = new Date();
//         expirationDate.setDate(expirationDate.getDate() + daysToExpire);
//         const expirationUTCString = expirationDate.toUTCString();
//         document.cookie = `${cookieName}=${cookieValue}; expires=${expirationUTCString}; path=/`;
//     }
//
// // 获取 Cookie 值
//     function getCookie(cookieName) {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.startsWith(cookieName + '=')) {
//                 return cookie.substring(cookieName.length + 1);
//             }
//         }
//         return null;
//     }
//
//     /**
//      * used for testing new user login
//      * @param cookieName
//      */
//     function deleteCookie(cookieName) {
//         document.cookie = cookieName + "=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
//     }
//
//     //Set the last action of User
//     function setLastAction(action,user) {
//         const cookieName = 'action'+user;
//         setCookie(cookieName, action, 30); // 设置名为 'lastAction' 的 Cookie，有效期为 30 天
//     }
//     function getLastAction(user) {
//         const cookieName = 'action'+user;
//         return getCookie(cookieName);
//     }

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

    function deleteCookie(cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
    }

    function setLastAction(action) {
        const lastActionCookieName = 'LastAction_' + user;
        setCookie(lastActionCookieName, action, 30);
    }

    function getLastAction() {
        const lastActionCookieName = 'LastAction_' + user;
        return getCookie(lastActionCookieName);
    }


    //check which page Component to show
    // function determinePageToShow() {
    //     const lastAction = getLastAction()
    //    // const auctionList =  getClickedAuctionsFromCookies(); //TODO
    //
    //     if (!lastAction) {
    //         // 如果用户第一次访问应用，显示“购买”页面内容
    //         //if user is a new user show the BUY component
    //         setCookie('lastAction', 'acquisto', 30); //TODO 还需要处理lastAction 添加到cookie里并测试
    //         return 'ACQUISTO';
    //     } else {
    //         if (lastAction === 'creazioneAsta') {
    //             // 如果用户最后一次操作是创建拍卖，显示“出售”页面内容
    //             //if user last action was create auction show the SELL component
    //             return 'VENDO';
    //         } else {
    //             // 否则，显示“购买”页面内容并列出之前访问过的拍卖（如果有）
    //             //otherwise show the BUY component only showing all those auctions that user clicked and still with status open
    //             const auctionListArray = auctionList ? auctionList.split(',') : [];
    //             return 'ACQUISTO';
    //         }
    //     }
    // }

    //TODO 这部分还有争议 需要讨论处理
    //TODO 到底是传ArrayID通过JSON到servlet 还是 传全部的COOKIES 到 servlet 然后在servlet里面处理
    // 添加拍卖标识符到拍卖列表
    // Add auction id  to auction list BY CLICKING DETAILS
    function addToClickedAuctions(auctionID) {
        // 获取之前保存的点击过的 auction ID 数组（如果存在）
        const clickedAuctions = getCookie('clickedAuctions');
        let clickedAuctionsArray = [];

        if (clickedAuctions) {
            clickedAuctionsArray = JSON.parse(clickedAuctions);
        }

        // 将当前的 auction ID 添加到数组中
        clickedAuctionsArray.push(auctionID);

        // 将更新后的数组保存回 cookies
        setCookie('clickedAuctions', JSON.stringify(clickedAuctionsArray), 30);
    }

    function getClickedAuctionsFromCookies() {
        // 从 cookies 中获取保存的点击过的 auction ID
        const clickedAuctions = getCookie('clickedAuctions');

        if (clickedAuctions) {
            const clickedAuctionsArray = JSON.parse(clickedAuctions);


            // 在这里可以根据需要使用 clickedAuctionsArray 来进行后续处理
            console.log(clickedAuctionsArray); //Only for Testing //TODO remove this line
        }
    }


    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SELL PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
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

        this.reset = function () {
            ONautionDetails.reset();
            ONitemDetails.reset();
            ONofferDetails.reset();
            document.getElementById("id_ONtextListItem").style.visibility = "hidden";
            document.getElementById("id_ONtextListOffer").style.visibility = "hidden";
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
                            if (canClose === false) {
                                self.hidden();
                                return;
                            }
                            self.closeForm.style.visibility = "visible";
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
            document.getElementById("id_OFFtextListItem").style.visibility = "hidden";
            document.getElementById("id_OFFtextListOffer").style.visibility = "hidden";
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

    function AuctionDetails(_alert, _id_auctionDetailsContainer, _id_auctionDetailsBody, _id_textListItem, _id_textListOffer) {
        this.alert = _alert;
        this.auctionDetailsContainer = _id_auctionDetailsContainer;
        this.auctionDetailsBody = _id_auctionDetailsBody;
        this.textListItem = _id_textListItem;
        this.textListOffer = _id_textListOffer;
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
                            self.textListItem.style.visibility = "visible";
                            self.textListOffer.style.visibility = "visible";
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

    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ BUY PAGE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    //KeyAuctionList VIEW COMPONENT
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
                            alertContainer.textContent = "No keyAuction yet!";
                            return;
                        }

                        self.update(keyAucToShow);
                        self.listcontainer.style.visibility = "visible";
                        //self.listcontainer.classList.remove("hidden");
                    } else {
                        alert("No keyAuction found!");
                    }
                }
            })
        }
        this.update = function (arrayAuctions) {
            let row, auctionIdCell, ownerCell, priceCell, minUpCell, endDateCell, statusCell,
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
                anchor.setAttribute("keyAucID", auction.aucID);
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    currentAuctionID = e.target.getAttribute("keyAucID");

                    //adding Auction ID into Cookies
                    addToClickedAuctions(currentAuctionID);

                    alertContainer.textContent = "";
                    let auctionID = e.target.getAttribute("keyAucID");
                    let urlToCall = "GetOfferData?aucID=" + auctionID;

                    //after clicking on the details shows the details of items and wonAuction of user
                    giveOfferForm.style.visibility = "visible";
                    wonAuctionList.show();
                    itemDetailsList.show(auctionID);
                    offerList.show(auctionID);
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


                }, false);

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

    //OffernList VIEW COMPONENT
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
                        if (offerToShow.length === 0) {
                            alertContainer.textContent = "No offer yet!";
                            return;
                        }
                        self.listcontainer.style.visibility = "visible";
                        self.update(offerToShow);
                        ONofferDetails.update(offerToShow);

                    } else {
                        alertContainer.textContent = req.responseText;
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
            this.listcontainer.style.visibility = "hidden";
        }
    }

    //WonAuctionList VIEW COMPONENT
    function WonAuctionList(container, listcontainer) {
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset = function () {
            this.listcontainer.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;

            let urlToCall = "GetWonAuctionData";
            makeCall("GET", urlToCall, null, function (req) {

                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let wonAucToShow = JSON.parse(req.responseText);
                        if (wonAucToShow.length === 0) {
                            alertContainer.textContent = "No wonAuction yet!";
                            return;
                        }
                        self.listcontainer.style.visibility = "visible";
                        self.update(wonAucToShow);

                    } else {
                        alertContainer.textContent = req.responseText;
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
            this.listcontainer.style.visibility = "hidden";
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
                        self.listcontainer.style.visibility = "visible";
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
            this.listcontainer.style.visibility = "hidden";
        }
    }

    //TODO：这部分还没测试 是需要检查的 主要部分就是还差一个servlet 要写
    //StillOpenAuctionList VIEW COMPONENT
    function StillOpenAuctionList(container, listcontainer) {
        let self = this;
        this.listcontainer = container;
        this.listcontainerbody = listcontainer;
        this.reset = function () {
            this.listcontainer.style.visibility = "hidden";
        }
        this.show = function () {
            let self = this;
            let urlToCall = "GetStillOpenAuctionData";
            makeCall("GET", urlToCall, null, function (req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        let stillOpenAucToShow = JSON.parse(req.responseText);
                        if (stillOpenAucToShow.length === 0) {
                            alertContainer.textContent = "No still open auction yet!";
                            return;
                        }
                        self.listcontainer.style.visibility = "visible";
                        self.update(stillOpenAucToShow);
                    } else {
                        alertContainer.textContent = req.responseText;
                    }
                }
            })
        }


        // this.update = function (stillOpenAucToShow) {
        //     let row;
        //     let auctionIdCell;
        //     let ownerCell;
        //     let priceCell;
        //     let minUpCell;
        //     let endDateCell;
        //     let statusCell;
        //     let linkCell;
        //     let linktext;
        //     let anchor;
        //     this.listcontainerbody.innerHTML = "";
        //     stillOpenAucToShow.forEach(function (auction) {
        //         row = self.listcontainerbody.insertRow();
        //         auctionIdCell = row.insertCell();
        //         ownerCell = row.insertCell();
        //         priceCell = row.insertCell();
        //         minUpCell = row.insertCell();
        //         endDateCell = row.insertCell();
        //         statusCell = row.insertCell();
        //         linkCell = row.insertCell();
        //         auctionIdCell.textContent = auction.aucID;
        //         ownerCell.textContent = auction.owner;
        //         priceCell.textContent = auction.aucPrice + "€";
        //         minUpCell.textContent = auction.minUp + "€";
        //         endDateCell.textContent = auction.expiryDateTime;
        //         statusCell.textContent = auction.status;
        //         linktext = document.createTextNode("Details");
        //         anchor = document.createElement("a");
        //         anchor.href = "AuctionDetails?aucID=" + auction.aucID;
        //         anchor.appendChild(linktext);
        //         linkCell.appendChild(anchor);
        //
        //     });
        // }
        this.update = function (stillOpenAucToShow) {
            let row, auctionIdCell, ownerCell, priceCell, minUpCell, endDateCell, statusCell,
                linkCell, linktext, anchor;

            this.listcontainerbody.innerHTML = "";

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
                anchor.setAttribute("stillOpenAucID", auction.aucID);
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    currentAuctionID = e.target.getAttribute("stillOpenAucID");

                    //adding Auction ID into Cookies
                    addToClickedAuctions(currentAuctionID);

                    alertContainer.textContent = "";
                    let auctionID = e.target.getAttribute("stillOpenAucID");
                    let urlToCall = "GetOfferData?aucID=" + auctionID;

                    //after clicking on the details shows the details of items and wonAuction of user
                    giveOfferForm.style.visibility = "visible";
                    wonAuctionList.show();
                    itemDetailsList.show(auctionID);
                    offerList.show(auctionID);
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
                }, false);

                linkCell.appendChild(anchor);
                anchor.href = '#';
                row.appendChild(linkCell);
                self.listcontainerbody.appendChild(row);
            });
        }
    }

    //    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Listener ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


    searchKeywordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let keyword = keywordInput.value;
        if (keyword === "") {
            alert("Insert a keyword!");
            return;
        }
        setLastAction('searchKeyword');
        keyAucList.show(keyword);
        offerList.reset();
        itemDetailsList.reset();
        giveOfferForm.style.visibility = "hidden";
    }, false);

    giveOfferForm.addEventListener("submit", function (e) {
        let form = e.target.closest("form");
        e.preventDefault();
        console.log(currentAuctionID);
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
                        // 显示错误消息给用户，例如在页面上显示一个错误提示框
                        alert(errorMessage);
                    } else {
                        let errorMessage = "What a miser! Give a little more!";
                        // 显示通用错误消息给用户
                        alert(errorMessage);
                    }
                }
            }, false);
        } else {
            form.reportValidity();
        }
    }, false);


    function PageOrchestrator() {
        let alertContainer = document.getElementById("id_alert");

        this.start = function () {
            personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
            personalMessage.show();

            // -------------------------COOKIE-------------------------
            var isNewUser = getCookie('isNewUser');

            console.log("User is : " + user); //Only for Testing //TODO remove this line
            console.log(getLastAction(user)); //TODO remove this line

            // if (isNewUser === 'true') {
            //     // User is a new user show the BUY  component
            //     console.log("User is a new user"); //Only for Testing //TODO remove this line
            //     buyBlock.style.visibility = 'visible';
            //     sellBlock.style.visibility = 'hidden'; //TODO 要不要加个按钮 让用户显示SELL的Component
            //
            // } else {
            //
            //     // 使用 determinePageToShow() 函数确定要显示的页面
            //     const pageToShow = determinePageToShow();
            //
            //     // 根据 pageToShow 的值显示相应内容
            //     if (pageToShow === 'ACQUISTO') {
            //         // User is not a new user  show the Buy component only showing all those auctions that user clicked and still with status open
            //         //initialize the still open auction list
            //         stillOpenAuctionList = new StillOpenAuctionList(
            //             document.getElementById("id_stillOpenAuctionContainer"),
            //             document.getElementById("id_stillOpenAuctionContainerBody")
            //         ) ;
            //
            //         getClickedAuctionsFromCookies() //还需要处理 show still open auction
            //         buyBlock.style.visibility = 'visible';
            //
            //     } else if (pageToShow === 'VENDO') {
            //         // otherwise show the SELL  component if last action was create auction
            //         sellBlock.style.visibility = 'visible';
            //
            //     }
            //
            //     console.log("User is an existing user"); //Only for Testing //TODO remove this line
            //
            // }

            // -------------------------SELL PAGE ELEMENTS-------------------------
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
                document.getElementById("id_ONauctionDetailsBody"),
                document.getElementById("id_ONtextListItem"),
                document.getElementById("id_ONtextListOffer")
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
                document.getElementById("id_OFFauctionDetailsBody"),
                document.getElementById("id_OFFtextListItem"),
                document.getElementById("id_OFFtextListOffer")
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
            keyAucList.reset();
            offerList.reset();
            wonAuctionList.show();
            itemDetailsList.reset();
        }
    }
}