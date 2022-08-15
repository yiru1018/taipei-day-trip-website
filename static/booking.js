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

function go_to_homepage() {
  window.location.replace("/");
}
const logo = document.querySelector(".navbar__logo h1");
logo.addEventListener("click", go_to_homepage);

//this function is different from attraction, index
function check_if_signin() {
  let url = `/api/user`;
  let setting = { method: "GET" };
  let result = fetch_api(url, setting);
  result.then((result) => {
    if (result.data !== null) {
      navbar_member_btn.textContent = "登出系統";
      document.querySelector(".welcome-text__username").textContent =
        result.data["name"];
    } else {
      window.location.replace("/");
    }
  });
}

//only in booking.html
const show_booking_div = document.querySelector(".show-booking-div");
const no_booking_text = document.querySelector(".no-booking-text");
const footer = document.querySelector(".copyright");
function show_order() {
  show_booking_div.style.display = "flex";
  no_booking_text.style.display = "none";
  footer.style.height = "104px";
}
function show_no_order() {
  show_booking_div.style.display = "none";
  no_booking_text.style.display = "flex";
  footer.style.height = "80%";
}

let itinerary;
function render_order() {
  let url = `/api/booking`;
  let setting = { method: "GET" };
  itinerary = fetch_api(url, setting);
  itinerary.then((itinerary) => {
    if (itinerary.data !== null) {
      document.querySelector(".booking-info__name").textContent =
        itinerary.data.attraction["name"];
      document.querySelector(".booking-info__address").textContent =
        itinerary.data.attraction["address"];
      document.querySelector(".booking-info__img").src =
        itinerary.data.attraction["image"][0];
      document.querySelector(".booking-info__date").textContent =
        itinerary.data["date"];
      document.querySelector(
        ".booking-info__fee"
      ).textContent = `新台幣 ${itinerary.data["price"]} 元`;
      document.querySelector(".booking-info__time").textContent =
        itinerary.data["time"] === "afternoon" ? "下半天" : "上半天";
      document.querySelector(".show-total-fee").textContent =
        itinerary.data["price"];
      show_order();
    } else show_no_order();
  });
}
window.addEventListener("load", () => {
  check_if_signin();
  render_order();
});

function delete_order() {
  let url = `/api/booking`;
  let setting = { method: "DELETE" };
  let result = fetch_api(url, setting);
  result.then((result) => {
    if (result.hasOwnProperty("ok")) show_no_order();
  });
}
const delete_order_btn = document.querySelector(".booking-info__delete-btn");
delete_order_btn.addEventListener("click", delete_order);

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
  window.location.replace("/");
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

  let setting = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body),
  };
  let url = `/api/user`;
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

//payment flow
TPDirect.setupSDK(
  124027,
  "app_SDrvKeuo9VAIbHu6zJcNqRqNdcDBIW7U3OIOf7pwDI9Ipm9ev9A5xe0tMx0Z",
  "sandbox"
);

let fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "ccv",
  },
};
TPDirect.card.setup({
  fields: fields,
  styles: {
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
  },
});

function onSubmit(event) {
  event.preventDefault();

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    console.log("can not get prime");
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      console.log("get prime error " + result.msg);
      return;
    }
    console.log("get prime 成功，prime: " + result.card.prime);
    // console.log(result);

    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    console.log(itinerary);
    itinerary.then((itinerary) => {
      let headers = { "Content-Type": "application/json" };
      let body = {
        prime: result.card.prime,
        order: {
          price: itinerary.data["price"],
          trip: {
            attraction: itinerary.data.attraction,
            date: itinerary.data["date"],
            time: itinerary.data["time"],
          },
          contact: {
            name: document.querySelector(".contact-info__name").value,
            email: document.querySelector(".contact-info__email").value,
            phone: document.querySelector(".contact-info__phone-number").value,
          },
        },
      };
      console.log(body);
      let url = `/api/orders`;
      let setting = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      };
      let res = fetch_api(url, setting);
      res.then((res) => {
        if (result.hasOwnProperty("error")) {
        } else {
          console.log(res.data["number"]);
          window.location.replace(`/thankyou?number=${res.data["number"]}`);
        }
      });
    });
  });
}
const pay_button = document.querySelector(".total-info__submit");
pay_button.addEventListener("click", onSubmit);
