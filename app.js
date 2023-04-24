// Grabbing the HTML
let buttonOne = document.querySelector('#buttonOne')
let closetHolder = document.querySelector(".closetHolder")
let editPopup = document.querySelector('#editPopup')
let itemTypeLabel = document.querySelector("#clothingTypeEditLabel")
let descriptionLabel = document.querySelector("#descriptionEditLabel")
let itemSizeLabel = document.querySelector("#itemSizeEditLabel")
let itemComfortLabel = document.querySelector("#itemComfortEditLabel")
let itemRatingLabel = document.querySelector("#itemRatingEditLabel")
let loginButton = document.getElementById('logInBtn')
let signUpButton = document.getElementById('signUpBtn')
let emailInput = document.getElementById('email')
let passwordInput = document.getElementById('password')
let loginForm = document.querySelector(".login-form")
let wrapper = document.querySelector('.wrapper')


globalID = ''

// Setting variables
let description = ''
let closet = []

let closetFunc = () => {
    for (let i = 0;  i < closet.length; i++) {
        let deletButton = document.createElement('div')
        deletButton.innerHTML = "Delete"
        deletButton.onclick = function(){
            console.log("Delete")
        }
        closetHolder.insertAdjacentHTML("beforeend",
        `<li>${closet[i]}</li>`)
        
    }
}

setInformation = function() {
    let descriptionInformationInput = document.getElementById('description').value
    itemDescriptionValue = descriptionInformationInput
    // console.log(shirtInformationInput)
}

let changeDropdown = () => {
    
    itemTypeValue = document.querySelector("#clothingType").value
    itemSizeValue = document.querySelector('#itemSize').value
    itemComfortValue = document.querySelector("#itemComfort").value
    itemRatingValue = document.querySelector("#itemRating").value
}

setInformationEdit = function() {
    let descriptionInformationInput = document.getElementById('descriptionEdit').value
    itemDescriptionValueEdit = descriptionInformationInput
    // console.log(shirtInformationInput)
}

let changeDropdownEdit = () => {
    
    itemTypeValueEdit = document.querySelector("#clothingTypeEdit").value
    itemSizeValueEdit = document.querySelector('#itemSizeEdit').value
    itemComfortValueEdit = document.querySelector("#itemComfortEdit").value
    itemRatingValueEdit = document.querySelector("#itemRatingEdit").value
}

buttonOne.onclick = () => {
    // console.log(shirtInfo)
    addItemToCloset(itemTypeValue, itemDescriptionValue, itemSizeValue, itemComfortValue, itemRatingValue)
    // console.log(dropdown)
}

function deleteItemFromCloset(itemId){
    fetch(`http://localhost:8080/closet/${itemId}`, {
        credentials: 'include',
        method: 'DELETE'
        
    }).then(function(response){
        if(response.status == 202){
            loadClothesFromServer()
        }
        else{
            console.log(`Server responded with ${response.status} when trying to delete an item from the closet.`)
        }
    })
}


let loadClothesFromServer =  () => {
    fetch('http://localhost:8080/closet', {credentials: 'include'}).then(function(res){
        res.json().then(function(data){
            if(res.status == 200){
                console.log(data)
                closet = data
                // closetFunc()
                // HIDE LOGIN AND SHOW CLOSET
                loginForm.style.display = 'none'
                wrapper.style.display = 'flex'
                closetHolder.innerHTML = ""
                closet.forEach(item => {
                    var newItem = document.createElement("li")

                    var itemType = document.createElement('div')
                    itemType.innerHTML = `Type - ${item.itemType}`
                    itemType.classList.add("itemType")
                    newItem.appendChild(itemType)

                    var itemDescription = document.createElement('div')
                    itemDescription.innerHTML = `Description - ${item.description}`
                    itemDescription.classList.add("itemDescription")
                    newItem.appendChild(itemDescription)

                    var itemSize = document.createElement('div')
                    itemSize.innerHTML = `Size - ${item.size}`
                    itemSize.classList.add("itemSize")
                    newItem.appendChild(itemSize)

                    var itemComfort = document.createElement('div')
                    itemComfort.innerHTML = `Comfort - ${item.comfort}`
                    itemComfort.classList.add("itemComfort")
                    newItem.appendChild(itemComfort)

                    var itemRating = document.createElement('div')
                    itemRating.innerHTML = `Rating - ${item.rating}`
                    itemRating.classList.add("itemRating")
                    newItem.appendChild(itemRating)

                    var editButton = document.createElement('div')
                    editButton.innerHTML = 'Edit'
                    editButton.classList.add("editButton")
                    editButton.onclick = function(){
                        globalID = item.id
                        console.log(globalID)
                        itemTypeLabel.innerHTML = item.itemType
                        descriptionLabel.innerHTML = item.description
                        itemSizeLabel.innerHTML = item.size
                        itemComfortLabel.innerHTML = item.comfort
                        itemRatingLabel.innerHTML = item.rating
                        editPopup.style.display = "flex"
                        
                    }
                    newItem.appendChild(editButton)


                    var deleteButton = document.createElement('div')
                    deleteButton.innerHTML = "Delete"
                    deleteButton.classList.add("deleteButton")
                    deleteButton.onclick = function(){
                        console.log("Delete")
                        deleteItemFromCloset(item.id)
                    }
                    newItem.appendChild(deleteButton)

                    closetHolder.appendChild(newItem)
                })
            }
            else{
                // THE OPPOSITE OF BEFORE.
                loginForm.style.display = 'flex'
                wrapper.style.display = 'none'
                console.log('An error occurred', data)
            }
        })
    })
}

function addItemToCloset(itemType, description, size, comfort, rating){
    console.log(itemType, description, size, comfort, rating)
    if(description != '' && itemType != '' && size != '' && comfort != '' && rating != ''){
        // let data = `itemType=${encodeURIComponent(dropdown)}&description=${encodeURIComponent(description)}&rating=${encodeURIComponent(rating)}`
        let data = `itemType=${encodeURIComponent(itemType)}&description=${encodeURIComponent(description)}&size=${(size)}&comfort=${(comfort)}&rating=${(rating)}`
        console.log(data)

        fetch("http://localhost:8080/closet", {
            credentials: 'include',
            method: "POST",
            body: data,
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(response){
            if(response.status == 201){

                loadClothesFromServer()
            }
            else{
                console.log("Error Occurred", {response})
            }
        })
    }
    else{
        console.log("Empty Input")
    }
}

closeEditPopup = () => {
    editPopup.style.display = "none"
}

function confirmChanges(){
    if(itemDescriptionValueEdit != '' && itemTypeValueEdit != '' && itemSizeValueEdit != '' && itemComfortValueEdit != '' && itemRatingValueEdit != ''){
        // let data = `itemType=${encodeURIComponent(dropdown)}&description=${encodeURIComponent(description)}&rating=${encodeURIComponent(rating)}`
        let data = `itemType=${encodeURIComponent(itemTypeValueEdit)}&description=${encodeURIComponent(itemDescriptionValueEdit)}&size=${(itemSizeValueEdit)}&comfort=${(itemComfortValueEdit)}&rating=${(itemRatingValueEdit)}`
        console.log(data)

        fetch(`http://localhost:8080/closet/${globalID}`, {
            credentials: 'include',
            method: "PUT",
            body: data,
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(response){
            if(response.status == 200){
                loadClothesFromServer()
                globalID = ''
                closeEditPopup()
            }
            else{
                console.log("Error Occurred", {response})
            }
        })
    }
    else{
        console.log("Empty Input")
    }
}

loginButton.addEventListener('click', () => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
  
    // add code to validate the email and password
    if (!email || !password) {
        alert('Please try again.')
        emailInput.value = ""
        passwordInput.value = ""
        return
    }
    
    // Use regex to check if the email is valid
    // I don't know regex very well, so I am borrowing this to check if the user entered a valid email address.
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.')
        emailInput.value = ""
        passwordInput.value = ""
        return
    }
  
    // Verify login data is correct or incorrect
    let data = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`

    fetch(`http://localhost:8080/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(response => {
        console.log(response)
        if (response.status == 200) {
            console.log(response.status)
            loadClothesFromServer()
            console.log("success")
        } else {
            alert('Login failed. Please try again.')
            emailInput.value = ""
            passwordInput.value = ""
            throw new Error('Login failed. Please try again.')
        }
    })
    .catch(error => {
        console.error(error)
    })
})

signUpButton.addEventListener('click', () => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
  
    // add code to validate the email and password
    if (!email || !password) {
        alert('Please try again.')
        emailInput.value = ""
        passwordInput.value = ""
        return
    }
    
    // Use regex to check if the email is valid
    // I don't know regex very well, so I am borrowing this to check if the user entered a valid email address.
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.')
        emailInput.value = ""
        passwordInput.value = ""
        return
    }
  
    // add code to send the register credentials to the server
    let data = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`

    fetch(`http://localhost:8080/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(response => {
        console.log(response)
        if (response.status == 201) {
            loadClothesFromServer()
            console.log('success')
        } else {
            alert('An account already exists with this email. Please try again.')
            emailInput.value = ""
            passwordInput.value = ""
            throw new Error('An account already exists with this email.');
        }
    })
    .catch(error => {
        console.error(error)
    })
})

loadClothesFromServer()