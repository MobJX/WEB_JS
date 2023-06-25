{
    let keyAucList = null;
    let offerList = null;
    let wonAuctionList = null;
    let itemDetailsList = null;
    let currentAuctionID = null;
    let stillOpenAuctionList = null;

    let searchKeywordForm = document.getElementById('id_getKeyAuctionForm');
    let keywordInput = document.getElementById('id_keyword');
    let giveOfferForm = document.getElementById('id_giveOfferForm');
    let alertContainer = document.getElementById('id_alert');
    let buyBlock = document.getElementById('id_buyBlock');
    let sellBlock = document.getElementById('id_sellBlock');
    let stillOpenAuctionBlock = document.getElementById('id_stillOpenAuctionBlock');


    window.addEventListener("load", function () {
        var isNewUser = getCookie('isNewUser');
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


        keyAucList.reset();
        offerList.reset();
        wonAuctionList.show();
        itemDetailsList.reset();
    }, false);


    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ COOKIES MANAGEMENT COMPONENT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    //
    // 设置 Cookie
    function setCookie(cookieName, cookieValue, daysToExpire) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        const expirationUTCString = expirationDate.toUTCString();
        document.cookie = `${cookieName}=${cookieValue}; expires=${expirationUTCString}; path=/`;
    }

// 获取 Cookie 值
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

    /**
     * used for testing new user login
     * @param cookieName
     */
    function deleteCookie(cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
    }

    //check which page Component to show
    function determinePageToShow() {
        const lastAction = getCookie('lastAction');
        const auctionList = getCookie('auctionList');

        if (!lastAction) {
            // 如果用户第一次访问应用，显示“购买”页面内容
            //if user is a new user show the BUY component
            setCookie('lastAction', 'acquisto', 30); //TODO 还需要处理lastAction 添加到cookie里并测试
            return 'ACQUISTO';
        } else {
            if (lastAction === 'creazioneAsta') {
                // 如果用户最后一次操作是创建拍卖，显示“出售”页面内容
                //if user last action was create auction show the SELL component
                return 'VENDO';
            } else {
                // 否则，显示“购买”页面内容并列出之前访问过的拍卖（如果有）
                //otherwise show the BUY component only showing all those auctions that user clicked and still with status open
                const auctionListArray = auctionList ? auctionList.split(',') : [];
                return 'ACQUISTO';
            }
        }
    }

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




    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Listener ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


    searchKeywordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let keyword = keywordInput.value;
        if (keyword === "") {
            alert("Insert a keyword!");
            return;
        }
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


    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ View Component ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

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


}







