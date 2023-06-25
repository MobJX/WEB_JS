{
    //page components
    let createNewItem, openAuctionList, closedAuctionList, ONautionDetails, ONitemDetails,
        ONofferDetails, OFFautionDetails, OFFitemDetails, OFFofferDetails, createNewAuction,
        pageOrchestrator = new PageOrchestrator();
    //var itemButton = document.getElementById("id_newItemButton");

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

    function CreateNewItem(_alert, _id_createNewItem) {
        this.alert = _alert;
        this.createNewItem = _id_createNewItem;
        this.createItemButton = document.getElementById("id_newItemButton");
        this.itemName = document.getElementById("id_itemName");
        this.itemPrice = document.getElementById("id_itemPrice");
        this.itemDescription = document.getElementById("id_itemDescription");
        this.itemImage = document.getElementById("id_itemImage");

        this.reset = function () {
            this.createNewItem.style.visibility = "hidden";
            this.this.createItemButton.style.visibility = "hidden";
        }

        this.registerEvents = function (orchestrator) {
            this.createItemButton.addEventListener('click', (e) => {
                var form = e.target.closest("form");
                if (form.checkValidity()) {
                    e.preventDefault();
                    let self = this;

                    makeCall("POST", 'CreateNewItem', form,
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                var message = req.responseText;
                                if (req.status === 200) {
                                    orchestrator.refresh(message);
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

    /*
    function CreateNewItem() {
        // 获取表单元素的值
        var itemName = document.getElementById("id_itemName").value;
        var itemPrice = document.getElementById("id_itemPrice").value;
        var itemDescription = document.getElementById("id_itemDescription").value;
        var itemImage = document.getElementById("id_itemImage").value;

        // 创建一个 FormData 对象，并添加表单数据
        var formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("itemPrice", itemPrice);
        formData.append("itemDescription", itemDescription);
        formData.append("itemImage", itemImage);

        // 创建一个 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        // 设置请求的方法、URL 和异步标志
        xhr.open("GET", "CreateNewItem", true);

        // 监听 AJAX 请求的状态变化
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // 请求成功处理逻辑
                    var response = xhr.responseText;
                    // 处理返回的响应数据
                    console.log(response);
                } else {
                    // 请求失败处理逻辑
                    console.error("请求失败: " + xhr.status);
                }
            }
        };

        // 发送 AJAX 请求
        xhr.send(formData);
    }
*/
    //
    // function CreateNewAuction(newAuction, alert) {
    //     var now = new Date(), formattedDate = now.toISOString().substring(0, 10);
    //     this.newAuction = newAuction;
    //     this.alert = alert;
    //     this.newAuction.querySelector('input[type="datetime-local"]').setAttribute("min", formattedDate);
    //     this.registerEvents = function (orchestrator) {
    //         Array.from(this.newAuction.querySelectorAll("input[type='button'].next, input[type='button'].prev")).forEach(b => {
    //             b.addEventListener("click", (e) => {
    //                 var eventFieldset = e.target.closest("fieldset"), valid = true;
    //                 if (e.target.className == "next") {
    //                     for (i = 0; i < eventFieldset.elements.length; i++) {
    //                         if (!eventFieldset.elements[i].checkValidity()) {
    //                             eventFieldset.elements[i].reportValidity();
    //                             valid = false;
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 if (valid) {
    //                     this.changeStep(e.target.parentNode, (e.target.className === "next") ?
    //                         e.target.parentNode.nextElementSibling : e.target.parentNode.previousElementSibling);
    //                 }
    //             }, false);
    //         });
    //
    //         this.newAuction.querySelector("input[type='submit'][name='newAuctionButton']").addEventListener('click', (e) => {
    //             var eventFieldset = e.target.closest("fieldset"), vaild = true;
    //             for (let i = 0; i < eventFieldset.elements.lenght; i++) {
    //                 if (!eventFieldset.elements[i].checkValidity()) {
    //                     eventFieldset.elements[i].reportValidity();
    //                     valid = false;
    //                     break;
    //                 }
    //             }
    //             if (valid) {
    //                 let self = this;
    //                 makeCall("POST", "CreateNewAuction", e.target.closest("form"),
    //                     function (req) {
    //                         if (req.readyState == XMLHttpRequest.DONE) {
    //                             var message = req.responseText;
    //                             if (req.status == 200) {
    //                                 orchestrator.refresh(message);
    //                             } else if (req.status == 403) {
    //                                 window.location.href = req.getResponseHeader("Location");
    //                                 window.sessionStorage.removeItem('username');
    //                             } else {
    //                                 self.alert.textContent = message;
    //                                 self.reset();
    //                             }
    //                         }
    //                     });
    //             }
    //         });
    //
    //         this.newAuction.querySelector("input[type='button'].cancel").addEventListener('click', (e) => {
    //             e.target.closest('form').reset();
    //             this.reset();
    //         });
    //     };
    //
    //     this.reset = function () {
    //         var fieldsets = document.querySelectorAll("#" + this.newAuction.id + " fieldest");
    //         fieldsets[0].hidden = false;
    //         fieldsets[1].hidden = true;
    //     }
    //
    //     this.changeStep = function (origin, destination) {
    //         origin.hidden = true;
    //         destination.hidden = false;
    //     }
    // }
    //

    function OpenAuctionList(_alert, _id_openAuction, _id_openAuctionBody, _orchestrator) {
        this.alert = _alert;
        this.openAuction = _id_openAuction;
        this.openAuctionBody = _id_openAuctionBody;
        this.orchestrator = _orchestrator;
        this.current_openAuction;

        this.reset = function () {
            this.openAuction.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetOpenAuction", null,
                function (req) {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            var openAuctionToShow = JSON.parse(req.responseText);
                            openAuctionList.current_openAuction = openAuctionToShow;
                            if (openAuctionToShow.length == 0) {
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
            let row, rowItem, auctionIDCell, itemsCell, maxOfferCell, timeRemainingCell, linckCell, anchor;
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
                linckCell = document.createElement("td");
                anchor = document.createElement("a");
                linckCell.appendChild(anchor);
                linkText = document.createTextNode("Details");
                anchor.appendChild(linkText);
                anchor.setAttribute('aucID', auction.aucID);
                anchor.addEventListener("click", (e) => {
                    e.preventDefault();
                    ONautionDetails.show(e.target.getAttribute("aucID"));
                    ONitemDetails.show(e.target.getAttribute("aucID"));
                    ONofferDetails.show(e.target.getAttribute("aucID"));

                    makeCall("GET", "CheckStatusAuction?aucID=" + e.target.getAttribute("aucID"), null,
                        function (req) {
                            if (req.readyState == XMLHttpRequest.DONE) {
                                var message = req.responseText;
                                if (req.status == 200) {
                                    let canClose = JSON.parse(req.responseText);
                                    if (canClose != 0) {
                                        document.getElementById("id_closeForm").querySelector("input[type='button']")
                                            .addEventListener('click', (e) => {
                                                let form = e.target.closest("form"),
                                                    acutionToClose = form.querySelector("input[type = 'hidden']").value;
                                                makeCall("POST", "CloseAuction", form,
                                                    function (req) {
                                                        if (req.readyState === XMLHttpRequest.DONE) {
                                                            let message = req.responseText;
                                                            if (req.status === 200) {
                                                                openAuctionList.orchestrator.refresh(acutionToClose);
                                                            } else if (req.status === 403) {
                                                                window.location.href = req.getResponseHeader("Location");
                                                                window.sessionStorage.removeItem('username');
                                                            } else {
                                                                self.alert.textContent = message;
                                                            }
                                                        }
                                                    });
                                            });
                                    }
                                } else {
                                    self.alert.textContent = message;
                                }
                            }
                        });

                }, false);
                anchor.href = "#";
                row.appendChild(linckCell);
                self.openAuctionBody.appendChild(row);
            });
            this.openAuction.style.visibility = "visible";
        }

    }


    function ClosedAuctionList(_alert, _id_closedAuction, _id_closedAuctionBody) {
        this.alert = _alert;
        this.closedAuction = _id_closedAuction;
        this.closedAuctionBody = _id_closedAuctionBody;
        this.current_closedAuction;

        this.reset = function () {
            this.closedAuction.style.visibility = "hidden";
        }

        this.show = function () {
            let self = this;
            makeCall("GET", "GetClosedAuction", null,
                function (req) {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            var closedAuctionToShow = JSON.parse(req.responseText);
                            closedAuctionList.current_closedAuction = closedAuctionToShow;
                            if (closedAuctionToShow.length == 0) {
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
                exprDayTimeCell, bidderCell, finalPriceCell, linckCell, anchor;
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

                var bidderIdCell = document.createElement("td");
                bidderIdCell.textContent = auction.bidder != null ? auction.bidder.id : "";
                rowBidder.appendChild(bidderIdCell);

                var bidderUsernameCell = document.createElement("td");
                bidderUsernameCell.textContent = auction.bidder != null ? auction.bidder.username : "";
                rowBidder.appendChild(bidderUsernameCell);

                var bidderAddressCell = document.createElement("td");
                bidderAddressCell.textContent = auction.bidder != null ? auction.bidder.address : "";
                rowBidder.appendChild(bidderAddressCell);
                row.appendChild(rowBidder);

                finalPriceCell = document.createElement("td");
                finalPriceCell.textContent = auction.maxOffer + " €";
                row.appendChild(finalPriceCell);

                linckCell = document.createElement("td");
                anchor = document.createElement("a");
                linckCell.appendChild(anchor);
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
                row.appendChild(linckCell);
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
            var self = this;
            makeCall("GET", "GetAuctionData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            let auctionToShow = JSON.parse(req.responseText);
                            if (auctionToShow.length == 0) {
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

        this.update = function (autionDetails) {
            let row, auctionID, ownerID, startPrice, minRaise, exprDTime, closed;
            this.auctionDetailsBody.innerHTML = "";
            let self = this;
            row = document.createElement("tr");
            auctionIDCell = document.createElement("td");
            auctionIDCell.textContent = autionDetails.aucID;
            row.appendChild(auctionIDCell);
            ownerID = document.createElement("td");
            ownerID.textContent = autionDetails.ownerID;
            row.appendChild(ownerID);
            startPrice = document.createElement("td");
            startPrice.textContent = autionDetails.aucPrice + " €";
            row.appendChild(startPrice);
            minRaise = document.createElement("td");
            minRaise.textContent = autionDetails.minUP + " €";
            row.appendChild(minRaise);
            exprDTime = document.createElement("td");
            exprDTime.textContent = autionDetails.expiryDateTime;
            row.appendChild(exprDTime);
            closed = document.createElement("td");
            closed.textContent = autionDetails.isClosed;
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
            var self = this;
            makeCall("GET", "GetItemData?aucID=" + aucID, null,
                function (req) {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            let itemToShow = JSON.parse(req.responseText);
                            if (itemToShow.length == 0) {
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
            row = document.createElement("tr");
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
                    if (req.readyState == XMLHttpRequest.DONE) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            let offerToShow = JSON.parse(req.responseText);
                            if (offerToShow.length == 0) {
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

    function PageOrchestrator() {
        var alertContainer = document.getElementById("id_alert");

        this.start = function () {
            personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
            personalMessage.show();

            openAuctionList = new OpenAuctionList(
                alertContainer,
                document.getElementById("id_myOpenAuctionsContainer"),
                document.getElementById("id_myOpenAuctionsBody"),
                this
            );

            closedAuctionList = new ClosedAuctionList(
                alertContainer,
                document.getElementById("id_myClosedAuctionsContainer"),
                document.getElementById("id_myClosedAuctionsBody")
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

            //
            // createNewAuction = new CreateNewAuction(
            //     alertContainer,
            //     document.getElementById("id_createAuctionForm")
            // );
            // createNewAuction.registerEvents(this);
        };

        this.refresh = function (currentSellPage) {
            alertContainer.textContent = "";
            openAuctionList.show();
            closedAuctionList.show();
            //    createNewItem.reset;
            //    createNewAuction.reset;
        }
    }

    // itemButton.addEventListener("click", (e) =>{
    //    CreateNewItem();
    // });

}