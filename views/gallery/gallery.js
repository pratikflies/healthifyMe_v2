// JavaScript code to dynamically insert divs

// Sample data of images and captions
const imageData = [];
console.log(images);
images.forEach((document) => {
  const obj = {
    imageUrl: document.imageUrl,
    story: document.story,
  };
  imageData.push(obj);
});
/*const imageData = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    caption: "I'm so happy today!",
  },
];*/

// Get the gallery container
const galleryContainer = document.getElementById("gallery-container");

// Loop through the imageData array and create divs dynamically
imageData.forEach((data, index) => {
  // Create the div element
  const x = Math.floor(Math.random() * 10) + 1;
  const divElement = document.createElement("div");
  divElement.innerHTML = `
    <img class="grid-item grid-item-${x}" src="/${data.imageUrl}" alt="" />
    <p>"${data.story}"</p>
  `;

  // Append the created div to the gallery container
  galleryContainer.appendChild(divElement);
});
