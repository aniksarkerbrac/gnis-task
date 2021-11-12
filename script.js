let supplierArray = [];

// show existing suppliner in dropdown menu
fetch('http://localhost:5000/supplier')
    .then(res => res.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            const supplier = data[i].supplierName;
            supplierArray.push(supplier);
        }
        showDropDown();
    })

// Retrive data from database for invoice table
fetch('http://localhost:5000/invoice')
.then(res => res.json())
.then(data => {
    showTableData(data);
})

const showTableData = (invoices) =>{
    const tableBody = document.getElementById('tableBody');
    
    invoices.forEach(invoice =>{
        const tr = document.createElement('tr');
        const td = `
            <td>${invoice.invoiceNo}</td>
            <td>${invoice.supplierName}</td>
            <td>${invoice.itemName}</td>
            <td>${invoice.price}</td>
            <td>${invoice.quantity}</td>
            <td>${invoice.date}</td>
        `
        tr.innerHTML = td;
        tableBody.appendChild(tr);
    })
}

const handleSearch = (column, idName) => {
    const inputSearchValue = document.getElementById(idName.id).value.toUpperCase();
    const table = document.getElementById('tableBody');
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td")[column];

        if(td){
            const tableValue = td.innerText;
            if(tableValue.toUpperCase().indexOf(inputSearchValue)> -1){
                // tr[i].style.color = "red"
                tr[i].style.display="";
            }
            else{
                tr[i].style.display="none";
            }
        }    
    }    
}
const handleSearchRange = (e, colNum, startId,endId) => {
    
    const startPrice = document.getElementById(startId.id).value;
    const numStartPrice = parseInt(startPrice);
    const endPrice = document.getElementById(endId.id).value;
    const numEndPrice = parseInt(endPrice);
    console.log(typeof(numStartPrice));
    
    const table = document.getElementById('tableBody');
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td")[colNum];
        if(td){
            const tableValue = parseInt(td.innerText);
            console.log(typeof(tableValue));
            if((tableValue >= numStartPrice) && (tableValue <= numEndPrice)){
                // tr[i].style.display="";
                tr[i].style.color="red";
            }
            else{
                
                // tr[i].style.display="none";
            }
        }
    }
    e.preventDefault();
}


const showDropDown = () => {
    const list = document.getElementById('datalistOptions');
    supplierArray.forEach(supplier => {
        const option = document.createElement('option');
        option.innerText = supplier;
        list.appendChild(option);
    })
}

const handlekeypress = (event) => {
    if (event.charCode === 13) {
        event.preventDefault();
    }
}

// show popup if supplier is not registered.
const handleCheckNewSuppler = (event) => {
    if (event.charCode === 13) {
        event.preventDefault();
        let match = false;
        for (let i = 0; i < supplierArray.length; i++) {
            const name = supplierArray[i];
            if (name === event.target.value) {
                match = true;
                break;
            }
        }

        if (match === false) {
            var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
            myModal.show();
            document.getElementById('inputSupplierName').value = document.getElementById('exampleDataList').value
        }
    }
}
// Store new supplier data in database
const handleRegister = () => {
    const supplierCode = document.getElementById('inputSupplierCode').value;
    const supplierName = document.getElementById('inputSupplierName').value;
    const newSupplier = { supplierCode, supplierName }
    fetch('http://localhost:5000/addSupplier', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(newSupplier)
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                console.log("data inserted successful");
                document.getElementById('message').style.display = "block";
            }
        })
}

//Store new purchase data in database
const handlePurchaseInvoice = (event) => {
    
    const date = document.getElementById('inputDate').value;
    const invoiceNo = document.getElementById('inputInvoiceNo').value;
    const supplierName = document.getElementById('exampleDataList').value;
    const itemName = document.getElementById('inputItemName').value;
    const price = document.getElementById('inputPrice').value;
    const quantity = document.getElementById('inputQuantity').value;
    const newInvoice = { 
        date,
        invoiceNo,
        supplierName,
        itemName,
        price,
        quantity
    }

    fetch('http://localhost:5000/addInvoice', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(newInvoice)
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            alert('Purchase Invoice Created Successfully');
        }
    })
    event.preventDefault();
}



