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

//member form
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
    if (result.hasOwnProperty("error")) pop_up_signin_form();
    else window.location.replace("/booking");
  });
}
const navbar_booking_btn = document.querySelector("#booking_open_span");
navbar_booking_btn.addEventListener("click", booking_itinerary);
