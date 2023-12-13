// $(function() {

//   $('a.confirmDeletion').on('click', function () {
//     if(!confirm('Confirm Delete!'))
//       return false
//   })

//   if($(".errors-wrap .alert").length > 0){
//     let dealy = 4000;
//     $(".errors-wrap .alert").each(function() {
//       $(this).delay(dealy).slideUp(200, function() {
//         $(this).alert('close');
//       });
//       dealy += 500;
//     });
//   }
// })

// Sticky Menu
// Sticky Menu
window.addEventListener("scroll", function () {
  let header = document.querySelector(".myHeader");

  if (window.scrollY >= 200) {
    console.log("hi");
    // Add the 'fixed-header' class to make the header sticky
    header.classList.add("fixed-header");
  } else {
    // Remove the 'fixed-header' class to unstick the header
    header.classList.remove("fixed-header");
  }
});

//Offcanvas Toggler
const offcanvasToggler = document.querySelector("#offcanvas-toggler");
const offcanvasClose = document.querySelector(".offcanvas-close");
const offcanvasWrap = document.querySelector("#offcanvas-wrap");
const mainBody = document.querySelector("body");

offcanvasToggler.addEventListener("click", () => {
  mainBody.classList.toggle("offcanvas-active");
  offcanvasWrap.classList.toggle("active");
});

offcanvasClose.addEventListener("click", () => {
  mainBody.classList.toggle("offcanvas-active");
  offcanvasWrap.classList.toggle("active");
});

const offcanvasOveraly = document.querySelector(".offcanvas-overaly");
offcanvasOveraly.addEventListener("click", () => {
  mainBody.classList.remove("offcanvas-active");
  offcanvasWrap.classList.remove("active");
});

//Cart Toggler
const cartMenu = document.querySelector("#cart-menu");
const cartDropdown = document.querySelector("#cart-dropdown");

cartMenu.addEventListener("click", () => {
  cartDropdown.classList.toggle("active");
});

//Search Toggler
const searchToggler = document.querySelector("#search-toggler");
const searchBox = document.querySelector("#search-box");

searchToggler.addEventListener("click", () => {
  console.log("clicked");
  searchBox.classList.toggle("active");
});

const searchBtn = document.getElementById("search-btn");
const mainmenu = document.getElementsByClassName("mainmenu-wrap");
const closeSearch = document.getElementById("close-search");

searchBtn.addEventListener("click", () => {
  console.log("clicked");
  searchBox.classList.toggle("active");
  mainmenu.classList.toggle("active");
});

closeSearch.addEventListener("click", () => {
  console.log("Hi");
});

//Dismiss Alert
// let delay = 4000;
// const alert = document.querySelectorAll('.alert:not(.no-fade)');
// const noFadeAlert = document.querySelector('body').classList.contains('no-fade-alert');
// Array.prototype.forEach.call(alert, function(el, i){
//     el.addEventListener('click', function(e){
//         if(e.target.ariaLabel == "Close"){
//             if(el.parentNode.classList.contains('order-msg-wrap')){
//               el.parentNode.classList.remove('order-msg-wrap');
//             }
//             el.parentNode.removeChild(el);
//         }
//     })
//     if(!noFadeAlert){
//       //alert auto close
//       setTimeout(() => {
//           el.parentNode.removeChild(el);
//       }, delay);
//       delay += 500;
//     }
// });

//order msg
const orderSuccessMsg = document.querySelector(".order-success-msg");
if (orderSuccessMsg) {
  orderSuccessMsg.parentNode.classList.add("order-msg-wrap");
}

// Category Menu
const catMenu = document.querySelector("#wh-catmenu");
if (catMenu) {
  const hasChild = document.querySelectorAll(
    ".menu-item.has-child .toggle-icon"
  );
  hasChild.forEach(function (item) {
    item.addEventListener("click", function () {
      this.nextElementSibling.classList.toggle("active");
      this.closest(".menu-item.has-child").classList.toggle("active");
    });
  });
}

//ajax search
const search = document.getElementById("search");
const matchList = document.getElementById("match-list");

const searchStates = async (searchText) => {
  const headerSearchBox = document.querySelector("header #search-box>div");
  const httpPath = headerSearchBox.getAttribute("data-httpPath");
  const productsRes = await fetch(`${httpPath}/products/api/all`);
  const productStates = await productsRes.json();

  let matches = productStates.filter((state) => {
    const regex = new RegExp(`${searchText}`, "gi");
    return (
      state.title.match(regex) ||
      state.productid.match(regex) ||
      state.desc.match(regex)
    );
  });

  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = "";
  }
  outputHtml(matches);
};

const outputHtml = (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
          <div class="flex align-items-center relative mb-3">
            <a href="/products/${match.slug}" class="stretched-link"></a>
              <div class="mr-5">
                <img src="/images/products/${match.gallery_folder}/${
          match.gallery[0]
        }" class="img-fluid">
              </div>
              <div>
                <h4 class="mb-1 mt-3 text-lg font-bold">${match.title}</h4>
                <p class="m-0"><strong>${
                  match.discountprice
                    ? `<ins class="mr-1">Tk ${match.discountprice}</ins>
                <del class="text-secondary-focus">Tk ${match.price}</del>`
                    : match.price
                }</strong></p>
            </div>
          </div>`
      )
      .join("");
    matchList.innerHTML = html;
  }
};

search.addEventListener("input", () => searchStates(search.value));

//*********************** */ facebook pixel events *********************
//AddToCart
function AddToCart(product) {
  fbq("track", "AddToCart", {
    content_ids: product.id,
    content_name: product.title,
    content_type: "product",
    contents: [product],
    currency: "BDT",
    value: product.price,
  });
}

//Purchase
function Purchase(orderProducts) {
  let contents = [];
  let allSubTotal = null;
  for (let i = 0; i < orderProducts.length; i++) {
    contents.push({
      id: orderProducts[i].productid,
      quantity: orderProducts[i].qty,
    });
    let productPrice = null;
    if (orderProducts[i].discountprice) {
      productPrice = orderProducts[i].discountprice;
    } else {
      productPrice = orderProducts[i].price;
    }
    let subTotal = productPrice * orderProducts[i].qty;
    allSubTotal += Number(subTotal);
  }

  if (orderProducts.length > 0) {
    fbq("track", "Purchase", {
      content_ids: orderProducts[0].productid,
      content_name: orderProducts[0].title,
      content_type: "product",
      contents: contents,
      num_items: contents.length,
      currency: "BDT",
      value: allSubTotal,
    });
  }
}
//CompleteRegistration
function CompleteRegistration(orderProducts) {
  if (orderProducts.length > 0) {
    let allSubTotal = null;
    for (let i = 0; i < orderProducts.length; i++) {
      let productPrice = null;
      if (orderProducts[i].discountprice) {
        productPrice = orderProducts[i].discountprice;
      } else {
        productPrice = orderProducts[i].price;
      }
      let subTotal = productPrice * orderProducts[i].qty;
      allSubTotal += Number(subTotal);
    }

    fbq("track", "CompleteRegistration", {
      content_name: orderProducts[0].title,
      currency: "BDT",
      status: true,
      value: allSubTotal,
    });

    fbq("track", "Lead", {
      content_name: orderProducts[0].title,
      content_category: orderProducts[0].category_name,
      currency: "BDT",
      value: allSubTotal,
    });
  }
}

//ViewContent
function ViewContent(
  product_id,
  product_title,
  product,
  product_price,
  product_category
) {
  fbq("track", "ViewContent", {
    content_ids: product_id,
    content_name: product_title,
    content_category: product_category,
    content_type: "product",
    contents: [product],
    currency: "BDT",
    value: product_price,
  });
}

//add to cart ajax request
function addToCart(slug) {
  const formData = new FormData();
  formData.append("slug", slug);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const result = JSON.parse(this.responseText);

      //flash message
      const bodyWrapper = document.querySelector(".body-wrapper");
      let flashBox = document.createElement("div");
      flashBox.classList.add("errors-wrap");
      flashBox.innerHTML = `<div class="alert alert-success alert-hide-auto text-center my-5">Product added to cart.</div>`;
      bodyWrapper.append(flashBox);

      // update cart service
      // const cartList = `<div class="cartlist-dropdown">
      //   <ul>
      //     ${result.map(item => `<li>${item.title}</li>` ).join('')}
      //   </ul>
      // </div>`;
      // const cartMenuWrap = document.querySelector('.cartlist-wrap');
      // cartMenuWrap.innerHTML = cartList;

      //update cart counter
      const cartNotification = document.querySelector(".cart-notification");
      cartNotification.innerHTML = result.length;
    } else if (this.readyState == 4 && this.status != 200) {
      console.log("error occured!");
    }
  };
  xhr.open("POST", "/cart/add");
  xhr.send(formData);
}

const cartbtn = document.querySelectorAll(".cart-button");
if (cartbtn.length) {
  cartbtn.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const slug = this.dataset.slug;
      addToCart(slug);
    });
  });
}
