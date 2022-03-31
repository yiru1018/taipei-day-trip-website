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
let test_;
async function fetch_data() {
  let data_obj;
  try {
    let res = await fetch(`/api/attraction/${id}`);
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

//new
async function fetch_api(url, setting) {
  let response;
  try {
    response = await fetch(url, setting);
    response = await response.json();
  } catch (e) {
    console.log(`Error: ${e}`);
  }
  return response;
}

function check_if_signin() {
  let url = `/api/user`;
  let setting = { method: "GET" };
  let result = fetch_api(url, setting);
  result.then((result) => {
    navbar_member_btn.textContent =
      result.data !== null ? "登出系統" : "登入／註冊";
  });
}
window.addEventListener("load", check_if_signin);

//member btn in navbar
const member_form = document.querySelector(".member");
const member_background = document.querySelector(".member__open_background");
function pop_up_signin_form() {
  initialize_member_form(
    "登入會員帳號",
    "none",
    "登入帳戶",
    "還沒有帳戶了？點此註冊"
  );
  member_form.style.display = "flex";
  member_background.classList.add("member__open_background--darker");
}

function signout() {
  navbar_member_btn.textContent = "登入／註冊";
  let url = `/api/user`;
  let setting = { method: "DELETE" };
  fetch_api(url, setting);
}

function signout_or_popup() {
  if (navbar_member_btn.textContent === "登出系統") signout();
  else pop_up_signin_form();
}
const navbar_member_btn = document.querySelector("#member_open_span");
navbar_member_btn.addEventListener("click", signout_or_popup);

const member_text = document.querySelector(".member__text");
const member_submit_btn = document.querySelector(".member__btn");
const member_title = document.querySelector(".member__title");
const member_name_input = document.querySelector("#member_name");

let signin_form = true;
function switch_form() {
  if (signin_form) {
    initialize_member_form(
      "註冊會員帳號",
      "block",
      "註冊新帳戶",
      "已經有帳戶了？點此登入"
    );
    signin_form = false;
  } else {
    initialize_member_form(
      "登入會員帳號",
      "none",
      "登入帳戶",
      "還沒有帳戶了？點此註冊"
    );
    signin_form = true;
  }
}
member_text.addEventListener("click", switch_form);

function initialize_member_form(title, display, btn_text, last_text) {
  member_title.textContent = title;
  member_name_input.style.display = display;
  member_submit_btn.textContent = btn_text;
  member_text.textContent = last_text;
  member_input_list.forEach((element) => {
    element.value = "";
  });
}

function close_member_form() {
  member_form.style.display = "none";
  member_background.classList.remove("member__open_background--darker");
}
const close_member_form_btn = document.querySelector(".member__close");
close_member_form_btn.addEventListener("click", close_member_form);

const member_input_list = Array.from(
  document.getElementsByClassName("member__input")
);
function get_member_form_input_value() {
  let input_values = [];
  member_input_list.forEach((element) => {
    input_values.push(element.value);
  });
  return input_values;
}

function signin() {
  let input_values = get_member_form_input_value();
  let headers = { "Content-Type": "application/json" };
  let body = { email: input_values[1], password: input_values[2] };

  let url = `/api/user`;
  let setting = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body),
  };
  let result = fetch_api(url, setting);
  result.then((result) => {
    if (result.hasOwnProperty("ok")) {
      close_member_form();
      navbar_member_btn.textContent = "登出系統";
    }
    if (result.hasOwnProperty("error")) {
      member_text.textContent = response.message;
    }
  });
}

function signup() {
  let input_values = get_member_form_input_value();
  let headers = { "Content-Type": "application/json" };
  let body = {
    name: input_values[0],
    email: input_values[1],
    password: input_values[2],
  };

  let url = `/api/user`;
  let setting = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };
  let result = fetch_api(url, setting);
  result.then((result) => {
    member_input_list.forEach((element) => {
      element.value = "";
    });
    if (result.hasOwnProperty("ok")) {
      member_text.textContent = "註冊成功！點此登入";
    }
    if (result.hasOwnProperty("error")) {
      member_text.textContent = response.message;
    }
  });
}

function signin_or_signup() {
  if (member_submit_btn.textContent === "登入帳戶") signin();
  else signup();
}
member_submit_btn.addEventListener("click", signin_or_signup);

//booking btn in navbar
function booking_itinerary() {
  let url = `/api/booking`;
  let setting = { method: "GET" };
  let result = fetch_api(url, setting);
  result.then((result) => {
    if (result.hasOwnProperty("error")) window.location.replace("/");
    else window.location.replace("/booking");
  });
}
const navbar_booking_btn = document.querySelector("#booking_open_span");
navbar_booking_btn.addEventListener("click", booking_itinerary);

//only in attraction.html function
const booking_response = document.querySelector(".booking-response");
const booking_response_message = document.querySelector(
  ".booking-response__message"
);
function show_booking_response(result) {
  if (result.hasOwnProperty("error")) {
    booking_response_message.textContent = result.message;
    booking_response.style.display = "flex";
    member_background.classList.add("member__open_background--darker");
  } else window.location.replace("/booking");
}
const booking_response_comfirm = document.querySelector(
  ".booking-response__comfirm-btn"
);
function close_booking_response() {
  booking_response.style.display = "none";
  member_background.classList.remove("member__open_background--darker");
}
booking_response_comfirm.addEventListener("click", close_booking_response);

function make_order() {
  let price = document.querySelector('input[name="time"]:checked').value;
  let time = price === 2000 ? "morning" : "afternoon";

  let headers = { "Content-Type": "application/json" };
  let body = {
    attractionId: id,
    date: document.querySelector("#date").value,
    time: time,
    price: price,
  };

  let url = `/api/booking`;
  let setting = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };
  let result = fetch_api(url, setting);
  result.then((result) => {
    show_booking_response(result);
  });
}

const booking_btn = document.querySelector(".booking__btn");
booking_btn.addEventListener("click", make_order);
