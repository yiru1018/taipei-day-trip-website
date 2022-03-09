//get the wrapper
const image_wrapper = document.querySelector(".wrapper");

fetch(`http://18.177.180.125:3000/api/attractions?page=０`)
  .then((res) => res.json())
  .catch((error) => console.error("Error:", error))
  .then((attractions) => {
    for (let i = 0; i <= attractions.data.length - 1; i++) {
      //create attractions element
      const image_div = Object.assign(document.createElement("div"), {
        className: "image",
      });
      const img = document.createElement("img");
      const title_h3 = Object.assign(document.createElement("h3"), {
        className: "title",
      });
      const info_div = Object.assign(document.createElement("div"), {
        className: "info",
      });
      const mrt_h4 = Object.assign(document.createElement("h4"), {
        className: "mrt",
      });
      const category_h4 = Object.assign(document.createElement("h4"), {
        className: "category",
      });

      //fetch data from api
      img.src = attractions.data[i]["image"][0];
      title_h3.textContent = attractions.data[i]["name"];
      mrt_h4.textContent = attractions.data[i]["mrt"];
      category_h4.textContent = attractions.data[i]["category"];

      //show  attrctions
      info_div.append(mrt_h4, category_h4);
      image_div.append(img, title_h3, info_div);
      image_wrapper.appendChild(image_div);
    }
  });
