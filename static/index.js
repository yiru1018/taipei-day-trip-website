const image_wrapper = document.querySelector(".wrapper");
const keyword = document.getElementById("keyword");

//fetch attractions
let next_page;
let is_not_loading = true;
function fetch_attractions() {
  url = `/api/attractions?page=${render_page}`;

  if (keyword.value)
    url = `/api/attractions?page=${render_page}&keyword=${keyword.value}`;

  if (is_not_loading) {
    is_not_loading = false;
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
          let image_a = Object.assign(document.createElement("a"), {
            className: "image__link",
          });

          img.src = element["image"][0];
          title_h3.textContent = element["name"];
          mrt_h4.textContent = element["mrt"];
          category_h4.textContent = element["category"];
          image_a.href = `/attraction/${element["id"]}`;

          //deal with the info div out of image div
          if (title_h3.textContent.length >= 16) {
            title_h3.classList.add("special");
          }

          info_div.append(mrt_h4, category_h4);
          image_div.append(img, title_h3, info_div);
          image_a.appendChild(image_div);
          image_wrapper.appendChild(image_a);
        });
      });
    is_not_loading = true;
  }
}

function detect_mouse(e) {
  let mouse_move = e.deltaY;
  let screen_width = screen.width;
  if (screen_width > 1200) {
    if (next_page !== null) {
      if (mouse_move > 0) {
        render_page = next_page;
        fetch_attractions();
        window.removeEventListener("wheel", detect_mouse);
      }
    }
  }
}

function load_more() {
  const copyright_div = document.querySelector(".copyright");
  window.onscroll = function () {
    // console.log("inner", window.innerHeight);
    // console.log("body", document.body.offsetHeight);
    if (
      document.body.offsetHeight - (window.innerHeight + window.scrollY) <=
      1
    ) {
      if (next_page !== null) {
        render_page = next_page;
        fetch_attractions();
      } else copyright_div.style.opacity = 1;
    }
  };
}

window.addEventListener("wheel", detect_mouse);
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

//navbar
const member_form = document.querySelector(".member");
const member_background = document.querySelector(".member__open_background");
function pop_up_signin_form() {
  initialize_member_form();
  member_form.style.display = "flex";
  member_background.classList.add("member__open_background--darker");
}

function signout() {
  navbar_member_btn.textContent = "登入／註冊";
  fetch(`/api/user`, { method: "DELETE" })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error));
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
  member_input_list.forEach((element) => {
    element.value = "";
  });
  if (signin_form) {
    member_title.textContent = "註冊會員帳號";
    member_name_input.style.display = "block";
    member_submit_btn.textContent = "註冊新帳戶";
    member_text.textContent = "已經有帳戶了？點此登入";
    signin_form = false;
  } else {
    member_title.textContent = "登入會員帳號";
    member_name_input.style.display = "none";
    member_submit_btn.textContent = "登入帳戶";
    member_text.textContent = "還沒有帳戶了？點此註冊";
    signin_form = true;
  }
}
member_text.addEventListener("click", switch_form);

function initialize_member_form() {
  member_title.textContent = "登入會員帳號";
  member_name_input.style.display = "none";
  member_submit_btn.textContent = "登入帳戶";
  member_text.textContent = "還沒有帳戶了？點此註冊";
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
  let url = `/api/user`;
  let headers = { "Content-Type": "application/json" };
  let body = { email: input_values[1], password: input_values[2] };

  fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      if (response.hasOwnProperty("ok")) {
        close_member_form();
        navbar_member_btn.textContent = "登出系統";
      }
      if (response.hasOwnProperty("error")) {
        member_text.textContent = response.message;
      }
    });
}

function signup() {
  let input_values = get_member_form_input_value();
  let url = `/api/user`;
  let headers = { "Content-Type": "application/json" };
  let body = {
    name: input_values[0],
    email: input_values[1],
    password: input_values[2],
  };

  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      member_input_list.forEach((element) => {
        element.value = "";
      });
      if (response.hasOwnProperty("ok")) {
        member_text.textContent = "註冊成功！點此登入";
      }
      if (response.hasOwnProperty("error")) {
        member_text.textContent = response.message;
      }
    });
}

function signin_or_signup() {
  if (member_submit_btn.textContent === "登入帳戶") signin();
  else signup();
}

member_submit_btn.addEventListener("click", signin_or_signup);

function check_if_signin() {
  fetch(`/api/user`, { method: "GET" })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      if (response.data !== null) navbar_member_btn.textContent = "登出系統";
    });
}

window.addEventListener("load", check_if_signin);
