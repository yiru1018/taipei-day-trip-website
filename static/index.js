//get the wrapper
const image_wrapper = document.querySelector(".wrapper");

//fetch attractions
let next_page;

function fetch_attractions() {
  next_page = fetch(
    `http://18.177.180.125:3000/api/attractions?page=${render_page}`
  )
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((attractions) => {
      for (let i = 0; i <= attractions.data.length - 1; i++) {
        //create attractions elemenlet
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

        img.src = attractions.data[i]["image"][0];
        title_h3.textContent = attractions.data[i]["name"];
        mrt_h4.textContent = attractions.data[i]["mrt"];
        category_h4.textContent = attractions.data[i]["category"];
        n = attractions.nextPage;

        //deal with the info div out of image div
        if (title_h3.textContent.length >= 16) {
          title_h3.classList.add("special");
        }

        info_div.append(mrt_h4, category_h4);
        image_div.append(img, title_h3, info_div);
        image_wrapper.appendChild(image_div);
      }
      return attractions.nextPage;
    });
}

//render page 1
let render_page = 0;
fetch_attractions();

//scroll down loading
const copyright_div = document.querySelector(".copyright");
window.onscroll = function (ev) {
  if (window.innerHeight + window.scrollY === document.body.offsetHeight) {
    next_page.then((page) => {
      if (page !== null) {
        render_page = page;
        setTimeout(fetch_attractions, 100);
      } else copyright_div.style.opacity = 1;
    });
  }
};

//search keyword
const search_btn = document.getElementById("search");

function keyword_attractions() {
  //get keyword
  const keyword = document.getElementById("keyword").value;
  console.log(keyword);

  //clear wrapper div
  image_wrapper.innerHTML = "";

  //fetch keyword attractions
  next_page = fetch(
    `http://18.177.180.125:3000/api/attractions?page=0&keyword=${keyword}`
  )
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((attractions) => {
      if (attractions.data.length === 0) {
        image_wrapper.textContent = `搜尋不到相關"${keyword}"的結果`;
      }
      for (let i = 0; i <= attractions.data.length - 1; i++) {
        //create attractions elemenlet
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

        img.src = attractions.data[i]["image"][0];
        title_h3.textContent = attractions.data[i]["name"];
        mrt_h4.textContent = attractions.data[i]["mrt"];
        category_h4.textContent = attractions.data[i]["category"];

        //deal with the info div out of image div
        if (title_h3.textContent.length >= 16) {
          title_h3.classList.add("special");
        }

        info_div.append(mrt_h4, category_h4);
        image_div.append(img, title_h3, info_div);
        image_wrapper.appendChild(image_div);
      }
      return attractions.nextPage;
    });

  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight) {
      next_page.then((page) => {
        if (page !== null) {
          setTimeout(
            (next_page = fetch(
              `http://18.177.180.125:3000/api/attractions?page=${page}&keyword=${keyword}`
            )
              .then((res) => res.json())
              .catch((error) => console.error("Error:", error))
              .then((attractions) => {
                if (attractions.data.length === 0) {
                  image_wrapper.textContent = `搜尋不到相關"${keyword}"的結果`;
                }
                for (let i = 0; i <= attractions.data.length - 1; i++) {
                  //create attractions elemenlet
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
                  let category_h4 = Object.assign(
                    document.createElement("h4"),
                    {
                      className: "category",
                    }
                  );

                  img.src = attractions.data[i]["image"][0];
                  title_h3.textContent = attractions.data[i]["name"];
                  mrt_h4.textContent = attractions.data[i]["mrt"];
                  category_h4.textContent = attractions.data[i]["category"];

                  //deal with the info div out of image div
                  if (title_h3.textContent.length >= 16) {
                    title_h3.classList.add("special");
                  }

                  info_div.append(mrt_h4, category_h4);
                  image_div.append(img, title_h3, info_div);
                  image_wrapper.appendChild(image_div);
                }
                return attractions.nextPage;
              })),
            100
          );
        } else copyright_div.style.opacity = 1;
      });
    }
  };
}

search_btn.addEventListener("click", keyword_attractions);
