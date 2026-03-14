const token = localStorage.getItem("token");

async function loadHotels(){

const res = await fetch("https://hotel-management-sys-qdkx.onrender.com/api/hotels",{

headers:{
"Authorization":`Bearer ${token}`
}

});

const hotels = await res.json();

const tbody = document.querySelector("#hotelTable tbody");

tbody.innerHTML = "";

hotels.forEach(hotel=>{

const row = `
<tr>
<td>${hotel.name}</td>
<td>${hotel.location}</td>
<td>${hotel.stars}</td>
<td>${hotel.price}</td>
</tr>
`;

tbody.innerHTML += row;

});

}

loadHotels();