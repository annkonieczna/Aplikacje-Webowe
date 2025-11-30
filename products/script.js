let table = document.getElementById("table");
let filterButton = document.getElementById("filterButton");
let firstProducts = [];

fetch("https://dummyjson.com/products") // wysyłamy requesta HTTP do podanego adresu
    .then((res) => res.json()) //zamienia nam naszą odpowiedź na format json 
    .then((data) => {
        firstProducts = data.products.slice(0,30);
        createTable(firstProducts);
    })


 function createTable(firstProducts) {
    const body = document.getElementsByTagName("tbody")[0];
    body.innerHTML = "" // czyścimy stare dane hehe

    firstProducts.forEach(element => {

        const row = body.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerHTML = '<img src="' + element.thumbnail + '" alt="Zdjęcie produktu">'; 
        cell2.innerHTML = element.title;
        cell3.innerHTML = element.description;

        
    });
 }


filterButton.addEventListener("click", () => {
    const filterInput = document.getElementById("filter").value.toLowerCase();
    const direction = document.getElementById("sort").value
    const filteredProducts = firstProducts.filter(
        (product) => 
            product.title.toLowerCase().includes(filterInput)  || product.description.toLowerCase().includes(filterInput)
    );
    switch(direction) {
        case "original": 
            break; 
        case "asc":
            filteredProducts.sort((row1,row2) => row1.title.localCompare(row2.title))
            break;
        case "desc": 
            filteredProducts.sort((row1, row2) => row2.title.localCompare(row1.title));
			break;
    }
    createTable(filteredProducts);
})

