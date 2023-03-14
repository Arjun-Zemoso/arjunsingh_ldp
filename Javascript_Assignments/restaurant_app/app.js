const menuDiv = document.querySelector('.menu-list');
let tablesJSONData;
let prices = new Map();
const getMenu = async () => {
    const res = await fetch('./data/menu.json');
    const data = await res.json();
    return data.menu;
}
getMenu().then((menuData) => {
    renderMenu(menuData);
})
const renderMenu = (menuData) => {
    for (let menuItem of menuData) {
        let menuCard = document.createElement('li');
        menuCard.setAttribute('draggable', 'true')
        menuCard.classList.add('menu-card', 'draggable');
        let menuHead = document.createElement('h3');
        menuHead.classList.add('menu-head');
        let menuPrice = document.createElement('p');
        menuPrice.classList.add('menu-price')
        let menuCuisine = document.createElement('p');
        menuCuisine.classList.add('cuisine');
        let menuCourse = document.createElement('p');
        menuCourse.classList.add('course');
        menuHead.textContent = menuItem.name;
        menuPrice.textContent = menuItem.price;
        prices.set(menuItem.name, menuItem.price);
        menuCuisine.textContent = menuItem.cuisine;
        menuCourse.textContent = menuItem.type;
        menuCard.append(menuHead, menuPrice, menuCuisine, menuCourse);
        menuCard.setAttribute("data-item", menuItem.name);
        menuCard.addEventListener('dragstart', dragStart);
        menuDiv.appendChild(menuCard);
    }

}
const menuSearch = document.querySelector('.inp-menu');
menuSearch.addEventListener('keyup', () => {
    handleMenuSearch(menuSearch.value);
})
const handleMenuSearch = (searchQuery) => {
    query = searchQuery.toLowerCase();
    menuItemsArray = menuDiv.querySelectorAll('li');
    // console.log(menuItemsArray);
    for (let i = 0; i < menuItemsArray.length; i++) {
        text = menuItemsArray[i].innerText.toLowerCase();
        if (text.includes(query)) {
            menuItemsArray[i].style.display = "";
        }
        else {
            menuItemsArray[i].style.display = "none";
        }

    }
}
const tablesDiv = document.querySelector('.table-list');
const getTables = async () => {
    const res = await fetch('./data/tables.json');
    const data = await res.json();
    tablesJSONData = data.tables;
    return data.tables;
}
getTables().then((tablesData) => {
    renderTable(tablesData);
})
const renderTable = (tablesData) => {
    for (let tableItem of tablesData) {
        let tableCard = document.createElement('li');
        tableCard.classList.add('table-card', 'droppable');
        let tableHead = document.createElement('h2');
        tableHead.classList.add('table-no');
        let tableBill = document.createElement('span');
        tableBill.classList.add('table-bill');
        // console.log(tableItem.table_no - 1);
        tableBill.setAttribute('id', 'tablebill' + (tableItem.table_no - 1).toString())
        let totalItems = document.createElement('span');
        totalItems.classList.add('total-items');
        totalItems.setAttribute('id', 'totalitems' + (tableItem.table_no - 1).toString());
        tableHead.textContent = tableItem.table_no;
        tableBill.textContent = tableItem.total_bill;
        totalItems.textContent = tableItem.total_items;
        tableCard.append(tableHead, tableBill, totalItems);
        tablesDiv.appendChild(tableCard);
        tableCard.addEventListener('click', (event) => { popupGeneration(event) });
        tableCard.setAttribute('id', tableItem.table_no - 1);
        tableCard.addEventListener('dragover', dragOver);
        tableCard.addEventListener('drop', drop);
    }

}
const popupGeneration = (event) => {
    let tableIndex = parseInt(event.target.id);
    // console.log(tableIndex);
    //Creating Popup
    let popup = document.createElement('div');
    popup.setAttribute('id', 'popup' + tableIndex);
    popup.classList.add('popup');
    let popupHead = document.createElement('div');
    popupHead.classList.add('popup-head');
    let popupTitle = document.createElement('h3');
    popupTitle.classList.add('popup-title');
    let closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = "\uD83D\uDDD9";
    popupTitle.textContent = tableIndex + 1;
    popupHead.append(popupTitle, closeButton);
    let tableContainer=document.createElement('div');
    tableContainer.classList.add('table-container');
    let popupTable = document.createElement('table');
    popupTable.classList.add('popup-table');
    let tableHeaderRow = document.createElement('tr');
    tableHeaderRow.classList.add('table-header');
    let headers = ['S no', 'Item', 'Price', 'No of units', ''];
    for (let i = 0; i < 5; i++) {
        let tableHeaderData = document.createElement('td');
        tableHeaderData.textContent = headers[i];
        tableHeaderRow.appendChild(tableHeaderData);
    }
    popupTable.appendChild(tableHeaderRow);
    let currentItems = tablesJSONData[tableIndex].current_items;
    for (let i = 0; i < currentItems.length; i++) {
        let tableRow = document.createElement('tr');
        let item = Object.keys(currentItems[i])[0];
        let units = currentItems[i][item];
        let price = prices.get(item) * units;
        let tableDataSno = document.createElement('td');
        tableDataSno.textContent = i + 1;
        let tableDataItem = document.createElement('td');
        tableDataItem.textContent = item;
        let tableDataPrice = document.createElement('td');
        tableDataPrice.setAttribute('id', item.replace(/\s/g, '') + tableIndex + 'price');
        tableDataPrice.textContent = price;
        let tableNoOfUnits = document.createElement('td');
        let unitsInput = document.createElement('input');
        unitsInput.classList.add('popup-input');
        unitsInput.setAttribute('type', 'number');
        unitsInput.setAttribute('min', '1');
        unitsInput.setAttribute('max', '7');
        unitsInput.setAttribute('id', tableIndex + item);
        unitsInput.value = units;
        unitsInput.addEventListener('input', event => { handleChangeInUnitsInput(event) })
        tableNoOfUnits.appendChild(unitsInput);
        let tableDataDelete = document.createElement('td');
        let deleteIcon = document.createElement('span');
        deleteIcon.classList.add('material-symbols-outlined');
        deleteIcon.textContent = 'delete'
        deleteIcon.setAttribute("data-table", tableIndex);
        deleteIcon.setAttribute("data-item", item);
        tableDataDelete.appendChild(deleteIcon);
        deleteIcon.addEventListener('click', (event) => { handleItemDelete(event) })
        tableRow.append(tableDataSno, tableDataItem, tableDataPrice, tableNoOfUnits, tableDataDelete);
        tableRow.setAttribute("id", item + tableIndex.toString());
        popupTable.appendChild(tableRow);
    }
    let billRow=document.createElement('tr');
    let td1=document.createElement('td');
    let td2=document.createElement('td');
    let totalBill = document.createElement('span');
    totalBill.setAttribute('colspan',2);
    totalBill.setAttribute('text-align','left');
    totalBill.classList.add('total-bill');
    let totalBillId = 'bill' + tableIndex;
    totalBill.setAttribute('id', totalBillId);
    billRow.append(td1,td2,totalBill);
    popupTable.appendChild(billRow)
    let generateBill = document.createElement('button');
    generateBill.textContent = "Generate Bill";
    generateBill.classList.add('generate-bill');
    tableContainer.appendChild(popupTable);
    popup.append(popupHead, tableContainer, generateBill);
    document.body.appendChild(popup);
    totalBill.textContent = getTotalBill(tableIndex);
    generateBill.addEventListener('click', () => {
        alert('Bill for Table ' + tableIndex + 1 + ' is ' + getTotalBill(tableIndex));
        document.body.removeChild(popup);
    })
    closeButton.addEventListener('click', () => document.body.removeChild(popup));
}
const handleChangeInUnitsInput = (event) => {
    let tableIndex = parseInt(event.target.id[0]);
    let itemName = event.target.id.substr(1);
    let itemsArray = tablesJSONData[tableIndex].current_items;
    for (let i = 0; i < itemsArray.length; i++) {
        let item = Object.keys(itemsArray[i])[0];
        if (item === itemName) {
            itemsArray[i][item] = event.target.value;
            let noOfunits = itemsArray[i][item];
            let priceCell = document.querySelector('#' + item.replace(/\s/g, '') + tableIndex + 'price');
            priceCell.textContent = prices.get(item) * noOfunits;
        }
    }
    let billSpan = document.querySelector('#bill' + tableIndex);
    let tableBill = document.querySelector('#tablebill' + tableIndex);
    let totalBill = getTotalBill(tableIndex);
    billSpan.textContent = totalBill;
    tableBill.textContent = totalBill;
}
const handleItemDelete = (event) => {
    // console.log(event.target);
    let tableIndex = parseInt(event.target.getAttribute("data-table"));
    let item = event.target.getAttribute("data-item");
    // console.log(tableIndex,item);
    let itemsArray = tablesJSONData[tableIndex].current_items;
    let indexItem;
    for (let indexItem = 0; indexItem < itemsArray.length; indexItem++) {
        let tableItem = Object.keys(itemsArray[indexItem])[0];
        if (item === tableItem) {
            break;
        }
    }
    tablesJSONData[tableIndex].current_items.splice(indexItem, 1);

    let e = {
        target: {
            id: tableIndex
        }
    };
    let oldPopup = document.querySelector('#popup' + tableIndex);
    document.body.removeChild(oldPopup);
    popupGeneration(e);
    updateTableBillAndItems(tableIndex);
    // console.log(tablesJSONData[tableIndex].current_items);
}
const tableSearch = document.querySelector('.inp-table');
tableSearch.addEventListener('keyup', () => {
    handleTableSearch(tableSearch.value);
})
const handleTableSearch = (searchQuery) => {
    query = searchQuery.replace(/\D/g, '');
    let tablesArray = tablesDiv.querySelectorAll('li');
    for (let i = 0; i < tablesArray.length; i++) {
        text = tablesArray[i].querySelector('.table-no').innerHTML.toLowerCase();
        if (text.includes(query)) {
            tablesArray[i].style.display = ""
        }
        else {
            tablesArray[i].style.display = "none"
        }
    }
}
const getTotalBill = (tableIndex) => {
    let sum = 0;
    let itemsArray = tablesJSONData[tableIndex].current_items;
    for (let i = 0; i < itemsArray.length; i++) {
        let item = Object.keys(itemsArray[i])[0];
        let units = itemsArray[i][item];
        sum += prices.get(item) * units;
    }

    return sum;

}

const dragStart = (event) => {
    //console.log(event);
    event.dataTransfer.setData("name", event.target.getAttribute('data-item'));
}
const dragOver = (event) => {
    event.preventDefault();
}
const drop = (event) => {
    event.preventDefault();
    let itemName = event.dataTransfer.getData('name');
    let tableIndex = parseInt(event.target.id);
    let currentItemsList = tablesJSONData[tableIndex].current_items
    for (let i = 0; i < currentItemsList.length; i++) {
        //console.log(currentItemsList[i]);
        let item = Object.keys(currentItemsList[i])[0];
        if (item === itemName) {
            tablesJSONData[tableIndex].current_items[i][itemName] += 1;
            let noOfUnits = tablesJSONData[tableIndex].current_items[i][itemName];
            updateTableBillAndItems(tableIndex);
            return;
        }
    }
    let newData = {}
    newData[itemName] = 1;
    tablesJSONData[tableIndex].current_items.push(newData);
    updateTableBillAndItems(tableIndex);
}
const updateTableBillAndItems = (tableIndex) => {
    let tableBill = document.querySelector('#tablebill' + tableIndex);
    let totalBill = getTotalBill(tableIndex);
    tableBill.textContent = totalBill;
    let totalItems = document.querySelector('#totalitems' + tableIndex);
    totalItems.textContent = tablesJSONData[tableIndex].current_items.length;
}