{
    let keyAucList = null;
    let offerList = null;
    let wonAuctionList = null;
    let itemDetailsList = null;
    let currentAuctionID = null;

    let searchKeywordForm = document.getElementById('id_getKeyAuctionForm');
    let keywordInput = document.getElementById('id_keyword');
    let giveOfferForm = document.getElementById('id_giveOfferForm');
    let alertContainer = document.getElementById('id_alert');


    window.addEventListener("load", function () {
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

// 判断要显示的页面
    function determinePageToShow() {
        const lastAction = getCookie('lastAction');
        const auctionList = getCookie('auctionList');

        if (!lastAction) {
            // 如果用户第一次访问应用，显示“购买”页面内容
            setCookie('lastAction', 'acquisto', 30);
            return 'ACQUISTO';
        } else {
            if (lastAction === 'creazioneAsta') {
                // 如果用户最后一次操作是创建拍卖，显示“出售”页面内容
                return 'VENDO';
            } else {
                // 否则，显示“购买”页面内容并列出之前访问过的拍卖（如果有）
                const auctionListArray = auctionList ? auctionList.split(',') : [];
                return 'ACQUISTO';
            }
        }
    }

// 使用 determinePageToShow() 函数确定要显示的页面
    const pageToShow = determinePageToShow();

// 根据 pageToShow 的值显示相应内容
    if (pageToShow === 'ACQUISTO') {
        // 显示“购买”页面内容
        // ...
    } else if (pageToShow === 'VENDO') {
        // 显示“出售”页面内容
        // ...
    }


    // 添加拍卖标识符到拍卖列表
    function addToAuctionList(auctionId) {
        const auctionList = getCookie('auctionList');
        if (auctionList) {
            // 如果拍卖列表 Cookie 已存在，将新的拍卖标识符追加到列表末尾
            const updatedAuctionList = auctionList + ',' + auctionId;
            setCookie('auctionList', updatedAuctionList, 30);
        } else {
            // 如果拍卖列表 Cookie 不存在，创建一个新的列表
            setCookie('auctionList', auctionId, 30);
        }
    }

// 获取拍卖列表
    function getAuctionList() {
        const auctionList = getCookie('auctionList');
        if (auctionList) {
            return auctionList.split(',');
        } else {
            return [];
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
                anchor.setAttribute("keyAucID", auction.aucID);
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    currentAuctionID = e.target.getAttribute("keyAucID");
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
                offerCell.textContent = offer.offerPrice;
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


        this.update = function(wonAucToShow) {
            let row, rowItem, auctionIDCell, itemsCell, auctionPriceCell, finalPriceCell, endDateCell;
            this.listcontainerbody.innerHTML = "";
            let self = this;

            wonAucToShow.forEach(function(auction) {
                row = document.createElement("tr");

                auctionIDCell = document.createElement("td");
                auctionIDCell.textContent = auction.aucID;
                row.appendChild(auctionIDCell);

                itemsCell = document.createElement("td");
                auction.aucItems.forEach(function(item) {
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
                auctionPriceCell.textContent = auction.aucPrice;
                row.appendChild(auctionPriceCell);

                finalPriceCell = document.createElement("td");
                finalPriceCell.textContent = auction.winningBid;
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
        this.reset = function () {
            this.listcontainer.style.visibility = "hidden";
        }
    }


}







