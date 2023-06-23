let availableItemList = null;
let openAuctionList = null;
let closedAuctionList = null;

let itemNameInput = document.getElementById("id_itemName");
let itemPriceInput = document.getElementById("id_itemPrice");
let itemDescriptionInput = document.getElementById("id_itemDescription");
let itemImageInput = document.getElementById("id_itemImage");

let createItemForm = document.getElementById("id_createItemForm");
let createAuctionForm = document.getElementById("id_createAuctionForm");

let createItemButton = document.getElementById("id_newItemButton");

window.addEventListener("load", function () {
    availableItemList = new AvailableItemList(
        document.getElementById("id_availableItemListContainer"),
        document.getElementById("id_availableItemListBody")
    );
    openAuctionList = new OpenAuctionList(
        document.getElementById("id_myOpenAuctionsContainer"),
        document.getElementById("id_myOpenAuctionsBody")
    );
    closedAuctionList = new ClosedAuctionList(
        document.getElementById("id_myClosedAuctionsContainer"),
        document.getElementById("id_myClosedAuctionsBody")
    );

}, false);

createItemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let itemName = itemNameInput.value;
    let itemPrice = itemPriceInput.value;
    let itemDescription = itemDescriptionInput.value;
    let itemImage = itemImageInput.value;

    if (itemName === "" || itemPrice === "" || itemDescription === "" || itemImage === "") {
        alert("Insert a keyword!");
        if (itemName === "") {
            itemNameInput.style.borderColor = "red";
        }
        if (itemPrice === "") {
            itemPriceInput.style.borderColor = "red";
        }
        if (itemDescription === "") {
            itemDescriptionInput.style.borderColor = "red";
        }
        if (itemImage === "") {
            itemImageInput.style.borderColor = "red";
        }
        return;
    }

    alert("Item Created Successfully!");
    e.preventDefault();
    if (createItemForm.checkValidity()) {
        let input = createItemForm.querySelector("input[type='button'].submit").value;
        var eventfieldset = e.target.closest("fieldset"), valid = true;
        for (let i = 0; i < eventfieldset.elements.length; i++) {
            if (!eventfieldset.elements[i].checkValidity()) {
                eventfieldset.elements[i].reportValidity();
                valid = false;
                break;
            }
        }

        if (valid) {
            let self = this;
            makeCall("GET", 'CreateNewItem', e.target.closest("form"),
                function (req) {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            let newItem = JSON.parse(req.responseText);
                            availableItemList.refresh(newItem);
                        } else if (req.status == 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem('username');
                        } else {
                            let errorMessage = req.responseText;
                            alert(errorMessage);
                        }
                    }
                }, false);
        }


    } else {
        createItemForm.reportValidity();
    }
}, false);

function AvailableItemList(container, listcontainer) {
    this.listcontainer = container;
    this.listcontainerbody = listcontainer;
    this.reset = function (currentItem) {
        alertContainer.textContent = "";        // not null after creation of status change
        availableItemList.reset();
    }

    this.show = function () {
        let self = this;
        makeCall("GET", "GetAvailableItem", null, function (req) {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    let availableItemToShow = JSON.parse(req.responseText);
                    if (availableItemToShow == 0) {
                        self.alert.textContent = "No item yet!";
                        return;
                    }
                    self.update(availableItemToShow);
                } else if (req.status == 403) {
                    window.location.href = req.getResponseHeader("Location");
                    window.sessionStorage.removeItem('username');
                } else {
                    alertContainer.textContent = req.responseText;
                }
            }
        }, false);
    };
    this.update = function (arrayItems) {
        let row, itemIdCell, itemNameCell, itemPriceCell, itemDescriptionCell, itemImageCell;
        this.listcontainerbody.innerHTML = ""; // empty the table body
        // build updated list
        let self = this;
        arrayItems.forEach(function (item) {
            row = document.createElement("tr");
            itemIdCell = document.createElement("td");
            itemIdCell.textContent = item.itemID;
            row.appendChild(itemIdCell);
            itemNameCell = document.createElement("td");
            itemNameCell.textContent = item.itemName;
            row.appendChild(itemNameCell);
            itemPriceCell = document.createElement("td");
            itemPriceCell.textContent = item.itemPrice;
            row.appendChild(itemPriceCell);
            itemDescriptionCell = document.createElement("td");
            itemDescriptionCell.textContent = item.itemDescription;
            row.appendChild(itemDescriptionCell);
            itemImageCell = document.createElement("td");
            itemImageCell.textContent = item.itemImage;
            row.appendChild(itemImageCell);
            self.listcontainerbody.appendChild(row);
        });
    };
}

function OpenAuctionList(container, listcontainer){
    this.listcontainer = container;
    this.listcontainerbody = listcontainer;

    this.reset = function() {
        this.listcontainer.style.visibility = "hidden";
    }

    this.show = function (){
        var self = this;
        makeCall("GET", "GetOpenAuction", null, function (req){
            if (req.readyState == 4) {
                if (req.status == 200) {
                    let openAuctionToShow = JSON.parse(req.responseText);
                    if (openAuctionToShow == 0) {
                        self.alert.textContent = "No Auction yet!";
                        return;
                    }
                    self.update(openAuctionToShow);
                } else if (req.status == 403) {
                    window.location.href = req.getResponseHeader("Location");
                    window.sessionStorage.removeItem('username');
                } else {
                    alertContainer.textContent = req.responseText;
                }
            }
        }, false);
    };

    this.update = function (arrayOpenAuctions)
}