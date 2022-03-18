//fetch attraction data
const image_div = document.querySelector(".image");
const name_h1 = document.querySelector("#name");
const category_div = document.querySelector("#category");
const mrt_div = document.querySelector("#mrt");
const descreption_div = document.querySelector("#descreption");
const address_div = document.querySelector("#address");
const transport_div = document.querySelector("#transport");
const img_indicator_div = document.querySelector(".img__indicator");
const img_slider_div = document.querySelector(".image__slider");

let id = window.location.href.match(/(\d+)$/)[1];

let image_list;
const image_width = image_div.getBoundingClientRect().width;
async function fetch_data() {
  let data_obj;
  try {
    let res = await fetch(`http://18.177.180.125:3000/api/attraction/${id}`);
    res = await res.json();
    data_obj = res.data;
  } catch (e) {
    console.log(`Error: ${e}`);
  }
  name_h1.textContent = data_obj["name"];
  category_div.textContent = data_obj["category"];
  mrt_div.textContent = data_obj["mrt"];
  descreption_div.textContent = data_obj["descreption"];
  address_div.textContent = data_obj["address"];
  transport_div.textContent = data_obj["transport"];

  image_list = data_obj["image"];
  let img;
  let dot;
  image_list.forEach((e, index) => {
    img = document.createElement("img");
    if (index === 0) img.classList.add("current-img");
    img.src = e;

    //arrange the images next to one another
    img.style.left = image_width * index + "px";
    img_slider_div.appendChild(img);

    const dot_class_name = index === 0 ? "dot dot--active" : "dot";
    dot = Object.assign(document.createElement("span"), {
      className: dot_class_name,
    });
    img_indicator_div.appendChild(dot);
  });

  //image slider
  const next_btn = document.querySelector(".img__btn--right");
  const prev_btn = document.querySelector(".img__btn--left");

  const slide_image = (img_slider_div, current_img, target_img) => {
    img_slider_div.style.transform =
      "translateX(-" + target_img.style.left + ")";
    current_img.classList.remove("current-img");
    target_img.classList.add("current-img");
  };

  const update_dots = (current_dot, target_dot) => {
    current_dot.classList.remove("dot--active");
    target_dot.classList.add("dot--active");
  };

  //button left function
  prev_btn.addEventListener("click", (e) => {
    const current_img = document.querySelector(".current-img");
    const prev_img = current_img.previousElementSibling;
    const current_dot = img_indicator_div.querySelector(".dot--active");
    const prev_dot = current_dot.previousElementSibling;

    if (prev_img) slide_image(img_slider_div, current_img, prev_img);
    if (prev_dot) update_dots(current_dot, prev_dot);
  });

  //button right function
  next_btn.addEventListener("click", (e) => {
    const current_img = document.querySelector(".current-img");
    const next_img = current_img.nextElementSibling;
    const current_dot = img_indicator_div.querySelector(".dot--active");
    const next_dot = current_dot.nextElementSibling;

    if (next_img) slide_image(img_slider_div, current_img, next_img);
    if (next_dot) update_dots(current_dot, next_dot);
  });

  //click dot move to the image
  const image_slides = Array.from(img_slider_div.children);
  const dots = Array.from(img_indicator_div.children);
  img_indicator_div.addEventListener("click", (e) => {
    //what dot was clicked on?
    const target_dot = e.target.closest("span");
    if (!target_dot) return;

    const current_img = img_slider_div.querySelector(".current-img");
    const current_dot = img_indicator_div.querySelector(".dot--active");
    const target_index = dots.findIndex((dot) => dot === target_dot);
    const target_img = image_slides[target_index];

    slide_image(img_slider_div, current_img, target_img);

    update_dots(current_dot, target_dot);
  });
}

fetch_data();

//fee radioobox reaction
const show_fee_div = document.querySelector(".booking__fee");
document.querySelectorAll("input[name='time']").forEach((element) => {
  element.addEventListener("change", function (event) {
    let fee = event.target.value;
    show_fee_div.textContent =
      fee === "2000" ? "新台幣 2000 元" : "新台幣 2500 元";
  });
});
