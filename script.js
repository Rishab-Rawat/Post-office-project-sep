document.getElementById("pincodeForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const pincode = document.getElementById("pincodeInput").value;
    const errorMessage = document.getElementById("error-message");
    const loader = document.getElementById("loader");
    const resultsContainer = document.getElementById("results-container");
    const noResultsMessage = document.getElementById("noResultsMessage");
    
    
    errorMessage.classList.add("hidden");
    noResultsMessage.classList.add("hidden");
    resultsContainer.classList.add("hidden");
    
    
    if (pincode.length !== 6 || isNaN(pincode)) {
      errorMessage.textContent = "Please enter a valid 6-digit pincode.";
      errorMessage.classList.remove("hidden");
      return;
    }
    
    
    loader.classList.remove("hidden");
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      
      loader.classList.add("hidden");
      
      
      if (data[0].Status !== "Success") {
        throw new Error(data[0].Message);
      }
  
      const postOffices = data[0].PostOffice;
      
      if (!postOffices || postOffices.length === 0) {
        throw new Error("No post offices found for this pincode.");
      }
      
      
      displayResults(postOffices);
      
    } catch (error) {
      loader.classList.add("hidden");
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
    }
  });
  
  function displayResults(postOffices) {
    const resultsList = document.getElementById("resultsList");
    const filterInput = document.getElementById("filterInput");
    const resultsContainer = document.getElementById("results-container");
  
    resultsList.innerHTML = "";
    
    
    postOffices.forEach(postOffice => {
      const listItem = document.createElement("li");
      listItem.textContent = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
      resultsList.appendChild(listItem);
    });
    
   
    resultsContainer.classList.remove("hidden");
  
    
    filterInput.addEventListener("input", function () {
      const filterValue = filterInput.value.toLowerCase();
      const filteredPostOffices = postOffices.filter(postOffice =>
        postOffice.Name.toLowerCase().includes(filterValue)
      );
      
      if (filteredPostOffices.length === 0) {
        document.getElementById("noResultsMessage").classList.remove("hidden");
      } else {
        document.getElementById("noResultsMessage").classList.add("hidden");
        updateResultsList(filteredPostOffices);
      }
    });
  }
  
  function updateResultsList(postOffices) {
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";
    postOffices.forEach(postOffice => {
      const listItem = document.createElement("li");
      listItem.textContent = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
      resultsList.appendChild(listItem);
    });
  }
  