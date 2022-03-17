const image_wrapper = document.querySelector(".wrapper");
const keyword = document.getElementById("keyword");

//fetch attractions
let next_page;
function fetch_attractions() {
  url = `http://18.177.180.125:3000/api/attractions?page=${render_page}`;

  if (keyword.value)
    url = `http://18.177.180.125:3000/api/attractions?page=${render_page}&keyword=${keyword.value}`;

  fetch(url)
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((attractions) => {
      next_page = attractions.nextPage;

      //keyword search no result
      if (attractions.data.length === 0) {
        image_wrapper.textContent = `搜尋不到相關"${keyword}"的結果`;
      }

      //render attractions
      attractions.data.forEach((element) => {
        let image_div = Object.assign(document.createElement("div"), {
          className: "image",
        });
        let img = document.createElement("img");
        let title_h3 = Object.assign(document.createElement("h3"), {
          className: "title",
        });
        let info_div = Object.assign(document.createElement("div"), {
          className: "info",
        });
        let mrt_h4 = Object.assign(document.createElement("h4"), {
          className: "mrt",
        });
        let category_h4 = Object.assign(document.createElement("h4"), {
          className: "category",
        });

        img.src = element["image"][0];
        title_h3.textContent = element["name"];
        mrt_h4.textContent = element["mrt"];
        category_h4.textContent = element["category"];

        //deal with the info div out of image div
        if (title_h3.textContent.length >= 16) {
          title_h3.classList.add("special");
        }

        info_div.append(mrt_h4, category_h4);
        image_div.append(img, title_h3, info_div);
        image_wrapper.appendChild(image_div);
      });
    });
}

function load_more() {
  const copyright_div = document.querySelector(".copyright");
  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight) {
      if (next_page !== null) {
        render_page = next_page;
        setTimeout(fetch_attractions, 100);
      } else copyright_div.style.opacity = 1;
    }
  };
}

//render homepage
let render_page = 0;
fetch_attractions();
load_more();

//search button function
function keyword_attractions() {
  //clear wrapper div content
  image_wrapper.innerHTML = "";

  //fetch keyword attractions
  render_page = 0;
  fetch_attractions();
  load_more();
}

const search_btn = document.getElementById("search");
search_btn.addEventListener("click", keyword_attractions);
