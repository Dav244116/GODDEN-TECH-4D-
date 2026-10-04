/* =========================================
   GODDEN TECH GLOBAL — 4D ENGINE
========================================= */

const canvas = document.getElementById("world");


/* =========================================
   THREE.JS SCENE
========================================= */

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
  0x030303,
  0.035
);


/* =========================================
   CAMERA
========================================= */

const camera =
  new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

camera.position.set(
  0,
  0,
  8
);


/* =========================================
   RENDERER
========================================= */

const renderer =
  new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


/* =========================================
   LIGHTING
========================================= */

const ambient =
  new THREE.AmbientLight(
    0xffffff,
    0.45
  );

scene.add(ambient);


const redLight =
  new THREE.PointLight(
    0xff0000,
    25,
    35
  );

redLight.position.set(
  2,
  1,
  4
);

scene.add(redLight);


const whiteLight =
  new THREE.PointLight(
    0xffffff,
    12,
    25
  );

whiteLight.position.set(
  -4,
  2,
  2
);

scene.add(whiteLight);


/* =========================================
   MAIN 4D CORE
========================================= */

const coreGeometry =
  new THREE.IcosahedronGeometry(
    1.25,
    2
  );

const coreMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.95,
    roughness: 0.15
  });

const core =
  new THREE.Mesh(
    coreGeometry,
    coreMaterial
  );

scene.add(core);


/* =========================================
   CORE WIREFRAME
========================================= */

const wireGeometry =
  new THREE.IcosahedronGeometry(
    1.7,
    2
  );

const wireMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });

const wire =
  new THREE.Mesh(
    wireGeometry,
    wireMaterial
  );

scene.add(wire);


/* =========================================
   ENERGY RINGS
========================================= */

const rings = [];

for (let i = 0; i < 4; i++) {

  const geometry =
    new THREE.TorusGeometry(
      2.1 + i * 0.35,
      0.012,
      16,
      160
    );

  const material =
    new THREE.MeshBasicMaterial({
      color:
        i % 2 === 0
          ? 0xff0000
          : 0xffffff,

      transparent: true,

      opacity:
        0.35 - i * 0.05
    });

  const ring =
    new THREE.Mesh(
      geometry,
      material
    );

  ring.rotation.x =
    Math.random() * Math.PI;

  ring.rotation.y =
    Math.random() * Math.PI;

  ring.rotation.z =
    Math.random() * Math.PI;

  scene.add(ring);

  rings.push(ring);
}


/* =========================================
   PARTICLE UNIVERSE
========================================= */

const particleCount = 3000;

const positions =
  new Float32Array(
    particleCount * 3
  );

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const radius =
    4 + Math.random() * 20;

  const theta =
    Math.random() *
    Math.PI *
    2;

  const phi =
    Math.acos(
      2 * Math.random() - 1
    );

  positions[i * 3] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);

  positions[i * 3 + 1] =
    radius *
    Math.sin(phi) *
    Math.sin(theta);

  positions[i * 3 + 2] =
    radius *
    Math.cos(phi);
}

const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",

  new THREE.BufferAttribute(
    positions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xffffff,

    size: 0.025,

    transparent: true,

    opacity: 0.7
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);


/* =========================================
   MOUSE / TOUCH
========================================= */

let mouseX = 0;
let mouseY = 0;

let targetCameraX = 0;
let targetCameraY = 0;


window.addEventListener(
  "pointermove",
  event => {

    mouseX =
      event.clientX /
      window.innerWidth *
      2 - 1;

    mouseY =
      event.clientY /
      window.innerHeight *
      2 - 1;
  }
);


/* =========================================
   PRODUCTS
========================================= */

const products = [

  {
    id: 1,

    name: "Godden X1",

    category: "Smartphones",

    description:
      "Premium flagship smartphone designed for speed, photography and everyday performance.",

    price: 850000,

    visual: "phone"
  },

  {
    id: 2,

    name: "Godden ProBook",

    category: "Laptops",

    description:
      "High-performance laptop built for creators, developers and professionals.",

    price: 1450000,

    visual: "laptop"
  },

  {
    id: 3,

    name: "Godden Pulse",

    category: "Audio",

    description:
      "Wireless premium headphones designed for immersive listening.",

    price: 320000,

    visual: "headphones"
  },

  {
    id: 4,

    name: "Godden Game X",

    category: "Gaming",

    description:
      "Next-generation gaming console concept for powerful entertainment.",

    price: 780000,

    visual: "console"
  },

  {
    id: 5,

    name: "Godden Watch",

    category: "Wearables",

    description:
      "Smart wearable designed to keep your digital life within reach.",

    price: 250000,

    visual: "phone"
  },

  {
    id: 6,

    name: "Godden Hub",

    category: "Accessories",

    description:
      "A premium multi-device charging and connectivity hub.",

    price: 95000,

    visual: "console"
  }

];


let cart = [];


/* =========================================
   PRODUCT RENDERING
========================================= */

const productsContainer =
  document.getElementById(
    "products"
  );


function money(value) {

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }
  ).format(value);

}


function renderProducts(
  category = null
) {

  const filtered =
    category
      ? products.filter(
          product =>
            product.category ===
            category
        )
      : products;


  productsContainer.innerHTML =
    filtered.map(
      product => `

      <article
        class="product-card"
        data-id="${product.id}"
      >

        <div class="product-visual">

          <div
            class="device ${product.visual}"
          ></div>

        </div>

        <div>

          <div class="product-category">
            ${product.category}
          </div>

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.description}
          </p>

          <div class="product-bottom">

            <span class="product-price">
              ${money(product.price)}
            </span>

            <button
              class="product-view"
              data-id="${product.id}"
            >
              VIEW
            </button>

          </div>

        </div>

      </article>
    `
    ).join("");

}


renderProducts();


/* =========================================
   PRODUCT MODAL
========================================= */

const modal =
  document.getElementById(
    "productModal"
  );

const modalName =
  document.getElementById(
    "modalName"
  );

const modalCategory =
  document.getElementById(
    "modalCategory"
  );

const modalDescription =
  document.getElementById(
    "modalDescription"
  );

const modalPrice =
  document.getElementById(
    "modalPrice"
  );

const modalAdd =
  document.getElementById(
    "modalAdd"
  );

let selectedProduct = null;


function openProduct(id) {

  const product =
    products.find(
      item =>
        item.id === id
    );

  if (!product) return;

  selectedProduct = product;

  modalName.textContent =
    product.name;

  modalCategory.textContent =
    product.category;

  modalDescription.textContent =
    product.description;

  modalPrice.textContent =
    money(product.price);

  modal.classList.add(
    "open"
  );
}


productsContainer.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".product-view"
      );

    if (!button) return;

    openProduct(
      Number(button.dataset.id)
    );
  }
);


document
  .getElementById("closeProduct")
  .addEventListener(
    "click",
    () => {
      modal.classList.remove(
        "open"
      );
    }
  );


modalAdd.addEventListener(
  "click",
  () => {

    if (!selectedProduct)
      return;

    addToCart(
      selectedProduct
    );

    modal.classList.remove(
      "open"
    );
  }
);


/* =========================================
   CART
========================================= */

const cartPanel =
  document.getElementById(
    "cartPanel"
  );

const cartItems =
  document.getElementById(
    "cartItems"
  );

const cartCount =
  document.getElementById(
    "cartCount"
  );

const cartTotal =
  document.getElementById(
    "cartTotal"
  );


function addToCart(product) {

  cart.push(product);

  updateCart();

  showNotification(
    `${product.name} added to your GODDEN bag.`
  );
}


function removeFromCart(index) {

  cart.splice(
    index,
    1
  );

  updateCart();
}


function updateCart() {

  cartCount.textContent =
    cart.length;


  if (!cart.length) {

    cartItems.innerHTML =
      `<p class="empty-cart">
        Your cart is empty.
      </p>`;

  } else {

    cartItems.innerHTML =
      cart.map(
        (item, index) => `

        <div class="cart-item">

          <div>

            <h4>
              ${item.name}
            </h4>

            <p>
              ${money(item.price)}
            </p>

          </div>

          <button
            class="remove-item"
            data-index="${index}"
          >
            REMOVE
          </button>

        </div>
      `
      ).join("");
  }


  const total =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum + item.price,
      0
    );

  cartTotal.textContent =
    money(total);
}


cartItems.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".remove-item"
      );

    if (!button) return;

    removeFromCart(
      Number(
        button.dataset.index
      )
    );
  }
);


document
  .getElementById("cartButton")
  .addEventListener(
    "click",
    () => {

      cartPanel.classList.add(
        "open"
      );
    }
  );


document
  .getElementById("closeCart")
  .addEventListener(
    "click",
    () => {

      cartPanel.classList.remove(
        "open"
      );
    }
  );


document
  .getElementById("checkoutButton")
  .addEventListener(
    "click",
    () => {

      if (!cart.length) {

        showNotification(
          "Your cart is empty."
        );

        return;
      }

      showNotification(
        "Checkout will connect to the GODDEN TECH backend."
      );
    }
  );


/* =========================================
   CATEGORY FILTER
========================================= */

document
  .querySelectorAll(
    ".category-card"
  )
  .forEach(
    card => {

      card.addEventListener(
        "click",
        () => {

          const category =
            card.dataset.category;

          renderProducts(
            category
          );

          document
            .getElementById(
              "store"
            )
            .scrollIntoView({
              behavior: "smooth"
            });
        }
      );
    }
  );


/* =========================================
   MOBILE MENU
========================================= */

const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );


document
  .getElementById("menuButton")
  .addEventListener(
    "click",
    () => {

      mobileMenu.classList.add(
        "open"
      );
    }
  );


document
  .getElementById("closeMenu")
  .addEventListener(
    "click",
    () => {

      mobileMenu.classList.remove(
        "open"
      );
    }
  );


mobileMenu
  .querySelectorAll("a")
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          mobileMenu.classList.remove(
            "open"
          );
        }
      );
    }
  );


/* =========================================
   4D EXPERIENCE
========================================= */

const experiencePanel =
  document.getElementById(
    "experiencePanel"
  );


document
  .getElementById(
    "experienceButton"
  )
  .addEventListener(
    "click",
    () => {

      experiencePanel.classList.add(
        "open"
      );
    }
  );


document
  .getElementById(
    "closeExperience"
  )
  .addEventListener(
    "click",
    () => {

      experiencePanel.classList.remove(
        "open"
      );
    }
  );


/* =========================================
   ENTER STORE
========================================= */

document
  .getElementById(
    "enterStore"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "store"
        )
        .scrollIntoView({
          behavior: "smooth"
        });

      camera.position.z = 5;
    }
  );


/* =========================================
   NOTIFICATION
========================================= */

const notification =
  document.getElementById(
    "notification"
  );

let notificationTimer;


function showNotification(
  message
) {

  notification.textContent =
    message;

  notification.classList.add(
    "show"
  );

  clearTimeout(
    notificationTimer
  );

  notificationTimer =
    setTimeout(
      () => {

        notification.classList.remove(
          "show"
        );

      },
      2500
    );
}


/* =========================================
   ABOUT
========================================= */

document
  .getElementById(
    "aboutButton"
  )
  .addEventListener(
    "click",
    () => {

      showNotification(
        "GODDEN TECH GLOBAL — Technology without limits."
      );
    }
  );


/* =========================================
   ANIMATION
========================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );

  const time =
    clock.getElapsedTime();


  /* Main core */

  core.rotation.x =
    time * .18;

  core.rotation.y =
    time * .27;


  core.position.y =
    Math.sin(
      time * 1.3
    ) * .15;


  /* Wireframe */

  wire.rotation.x =
    -time * .13;

  wire.rotation.y =
    time * .18;

  wire.position.y =
    core.position.y;


  /* Rings */

  rings.forEach(
    (
      ring,
      index
    ) => {

      ring.rotation.x +=
        .001 *
        (index + 1);

      ring.rotation.y +=
        .002 *
        (index + 1);

      ring.rotation.z +=
        .0007 *
        (index + 1);
    }
  );


  /* Particles */

  particles.rotation.y =
    time * .012;

  particles.rotation.x =
    Math.sin(
      time * .1
    ) * .04;


  /* Red light movement */

  redLight.position.x =
    Math.sin(
      time * .8
    ) * 3;

  redLight.position.y =
    Math.cos(
      time * .7
    ) * 2;


  /* Camera interaction */

  targetCameraX =
    mouseX * .7;

  targetCameraY =
    mouseY * .45;


  camera.position.x +=
    (
      targetCameraX -
      camera.position.x
    ) * .025;


  camera.position.y +=
    (
      -targetCameraY -
      camera.position.y
    ) * .025;


  camera.lookAt(
    0,
    0,
    0
  );


  renderer.render(
    scene,
    camera
  );
}


animate();


/* =========================================
   RESPONSIVE 3D
========================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);


/* =========================================
   LOADING SCREEN
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        document
          .getElementById(
            "loader"
          )
          .classList.add(
            "hidden"
          );

      },
      2400
    );
  }
);
