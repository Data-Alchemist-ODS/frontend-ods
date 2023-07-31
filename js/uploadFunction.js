const dropArea = document.querySelector('.drop-area');
const defaultView = document.getElementById("default");
const hoverView = document.getElementById("hover");
const uploadingView = document.getElementById("uploading");
const uploadedView = document.getElementById("uploaded");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const partitionView = document.getElementById("partition");
const databaseView = document.getElementById("database");
const button = document.querySelector('.button');
const input = document.getElementById('browse-input');
const database_button = document.getElementById('database-button');

let file;
let file_shard;
let file_database;

//when file is inside the drop area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log("inside");

    hoverView.style.display = "block ";
    defaultView.style.display = "none";
    dropArea.classList.add('active');
});

//when file outside the drop area
dropArea.addEventListener('dragleave', () => {
    console.log("outside");
    dropArea.classList.remove('active');
    defaultView.style.display = "block";
    hoverView.style.display = "none";
});

//when file is dropped in the drag area
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');
    file = event.dataTransfer.files[0]
    selectPartion();
});

//input will get clicked if button get clicked
button.onclick = () => {
    input.click();
};

//Action if input got clicked
input.addEventListener('change', function() {
    file = this.files[0]
    selectPartion();
});

function selectPartion(){
    const horizontal = document.getElementById("horizontal");
    const vertical = document.getElementById("vertical");

    dropArea.style.pointerEvents = 'none';
    defaultView.style.display = "none";
    hoverView.style.display = "none";
    partitionView.style.display = "block";
    partitionView.style.pointerEvents = 'auto';

    horizontal.addEventListener('click', function(){
        file_shard = horizontal.textContent ;
        selectDatabase();
    });
    vertical.addEventListener('click', function(){
        file_shard = vertical.textContent;
        selectDatabase();
    });
}

function selectDatabase(){
    partitionView.style.display = "none";
    databaseView.style.display = "block";
    databaseView.style.pointerEvents = "auto";


    const tidb = document.getElementById("tidb");
    const redis = document.getElementById("redis");
    const mongodb = document.getElementById("mongodb");

    tidb.addEventListener('click', function(){
        tidb.classList.toggle('database-option-clicked');
        updateDatabaseButton();
    });

    redis.addEventListener('click', function(){
        redis.classList.toggle('database-option-clicked');
        updateDatabaseButton();
    });

    mongodb.addEventListener( 'click', function(){
        mongodb.classList.toggle('database-option-clicked');
        updateDatabaseButton();
    });

    database_button.addEventListener('click', function(){
        const choosen_database = document.querySelectorAll('.database-option-clicked');
        file_database = [...choosen_database].map(element => element.textContent);
        choosen_database.forEach(element =>{
            element.classList.remove('database-option-clicked');
        });
        updateDatabaseButton();
        uploading();
    });
}

function updateDatabaseButton(){
    const total_clicked = document.querySelectorAll('.database-option-clicked').length;
    if(total_clicked > 1){
        database_button.textContent = "Upload Your File";
        database_button.classList.add("database-button-link");
    } else{
        database_button.classList.remove("database-button-link");
        database_button.textContent = "Select "+  ((-total_clicked) + 2) +" Or More:"
    }
}

async function uploading(){
    databaseView.style.display = "none";
    uploadingView.style.display = "block";

    fileName.textContent = file.name;
    size = file.size;

    if (size < 1024) {
        fileSize.textContent = size + 'b';
    } else if (size < 1048576) {
        fileSize.textContent = (size / 1024).toFixed(2) + 'kb';
    } else if (size < 1073741824) {
        fileSize.textContent = (size / (1048576)).toFixed(2) + 'mb';
    } else {
        fileSize.textContent = (size / (1073741824)).toFixed(2) + 'gb';
    }


    const formData = new FormData();
    formData.append('partitionType', file_shard);
    formData.append('shardingKey', "Age");
    file_database.forEach(element => {
        formData.append('database', element)
    })
    formData.append('data', file, file.name);

    try {
        const response = await fetch('http://127.0.0.1:8000/v1/api/transaction',{
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if(data.status != 200){
            console.log(data.message);
        } else {
            console.log(data.message);
        }
    } catch (err) {
        console.log('Error uploading file');
    }

    // console.log(file_shard);
    console.log(file_database);
    // console.log(file);
    // console.log(file.name);

    setTimeout(function() {
        uploadingView.style.display = "none";
        uploadedView.style.display = "block";
    
        setTimeout(function() {
            uploadedView.style.display = "none";
            defaultView.style.display = "block";
            dropArea.style.pointerEvents = '';
        }, 2000);
    }, 2000);

    input.value = '';   
};