document.getElementById("hotelForm").addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("name").value;
const location = document.getElementById("location").value;
const description = document.getElementById("description").value;
const stars = parseInt(document.getElementById("stars").value);
const price = parseInt(document.getElementById("price").value);
const image = document.getElementById("image").value;

const token = localStorage.getItem("token");

try {

const res = await fetch("http://localhost:5000/api/hotels", {

method: "POST",

headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`
},

body: JSON.stringify({
name,
location,
description,
stars,
price,
images: [image]   // ✅ correct field
})

});

const data = await res.json();

if(res.ok){

alert("Hotel Added Successfully");
document.getElementById("hotelForm").reset();

}else{

alert(data.message || "Error adding hotel");

}

}catch(error){

console.error(error);
alert("Server Error");

}

});