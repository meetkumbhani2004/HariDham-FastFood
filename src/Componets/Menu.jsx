// src/Components/Menus.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import "./Menu.css";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Products data frontend me hi rakha
const productsData = [
    {
    id: 1,
    name: "Paneer Butter Masala",
    category: "Indian",
    price: 220,
    rating: 4.6,
    description: "Rich creamy paneer curry.",
    image: "./1.1.avif",
  },
  {
    id: 2,
    name: "Vada Pav",
    category: "Fast Food",
    price: 30,
    rating: 4.5,
    description: "Mumbai's famous potato bun snack.",
    image: "46.webp",
  },
  {
    id: 3,
    name: "Veg Manchurian",
    category: "Chinese",
    price: 180,
    rating: 4.2,
    description: "Fried veggie balls in tangy sauce.",
    image: "/Images/3.webp",
  },
  {
    id: 4,
    name: "Hakka Noodles",
    category: "Chinese",
    price: 150,
    rating: 4.4,
    description: "Wok-tossed noodles with veggies.",
    image: "./4.webp",
  },
  {
    id: 5,
    name: "Margherita Pizza",
    category: "Fast Food",
    price: 199,
    rating: 4.3,
    description: "Classic cheese pizza with herbs.",
    image: "./5.webp",
  },
  {
    id: 6,
    name: "Peppy Paneer Pizza",
    category: "Fast Food",
    price: 249,
    rating: 4.5,
    description: "Paneer chunks with capsicum and spices.",
    image: "./6.webp",
  },
  {
    id: 7,
    name: "Veg Burger",
    category: "Fast Food",
    price: 99,
    rating: 4.1,
    description: "Crispy veggie patty with mayo.",
    image: "./7.webp",
  },
  {
    id: 8,
    name: "Cheese Burst Burger",
    category: "Fast Food",
    price: 129,
    rating: 4.3,
    description: "Cheesy burger with lettuce & sauce.",
    image: "./8.webp",
  },
  {
    id: 9,
    name: "Masala Dosa",
    category: "South Indian",
    price: 90,
    rating: 4.7,
    description: "Crispy dosa with potato stuffing.",
    image: "./9.webp",
  },
  {
    id: 10,
    name: "Idli Sambar",
    category: "South Indian",
    price: 60,
    rating: 4.5,
    description: "Steamed idli served with sambar.",
    image: "./10.webp",
  },
  {
    id: 11,
    name: "Chocolate Brownie",
    category: "Dessert",
    price: 99,
    rating: 4.9,
    description: "Fudgy brownie with nuts.",
    image: "./11.webp",
  },
  {
    id: 12,
    name: "Gulab Jamun",
    category: "Dessert",
    price: 50,
    rating: 4.8,
    description: "Sweet fried balls in syrup.",
    image: "./12.webp",
  },

  {
    id: 13,
    name: "Butter Naan",
    category: "Indian",
    price: 30,
    rating: 4.4,
    description: "Soft naan glazed with butter.",
    image: "./13.webp",
  },
  {
    id: 14,
    name: "Spring Rolls",
    category: "Chinese",
    price: 120,
    rating: 4.2,
    description: "Veg stuffed crispy rolls.",
    image: "./14.webp",
  },
  {
    id: 15,
    name: "French Fries",
    category: "Fast Food",
    price: 80,
    rating: 4.3,
    description: "Crispy potato fries.",
    image: "./15.webp",
  },
  {
    id: 16,
    name: "Cold Coffee",
    category: "Beverages",
    price: 70,
    rating: 4.1,
    description: "Chilled coffee with ice cream.",
    image: "./16.webp",
  },
  {
    id: 17,
    name: "Mango Shake",
    category: "Beverages",
    price: 60,
    rating: 4.4,
    description: "Refreshing mango milkshake.",
    image: "./17.webp",
  },
  {
    id: 18,
    name: "Falooda",
    category: "Dessert",
    price: 120,
    rating: 4.6,
    description: "Ice cream dessert with vermicelli.",
    image: "./18.webp",
  },
  {
    id: 19,
    name: "Chole Bhature",
    category: "Indian",
    price: 110,
    rating: 4.5,
    description: "Spicy chana with fried bhature.",
    image: "./19.webp",
  },
  {
    id: 20,
    name: "Samosa",
    category: "Indian",
    price: 20,
    rating: 4.2,
    description: "Crispy fried potato stuffed snack.",
    image: "./20.webp",
  },
  {
    id: 23,
    name: "Kathi Roll",
    category: "Fast Food",
    price: 100,
    rating: 4.3,
    description: "Stuffed paratha rolls.",
    image: "./23.webp",
  },
  {
    id: 24,
    name: "Veg Pulao",
    category: "Indian",
    price: 150,
    rating: 4.2,
    description: "Spiced rice with vegetables.",
    image: "24.webp",
    },
  {
    id: 25,
    name: "Rajma Chawal",
    category: "Indian",
    price: 140,
    rating: 4.4,
    description: "Kidney beans curry with rice.",
    image: "25.webp",
  },
  {
    id: 26,
    name: "Aloo Paratha",
    category: "Indian",
    price: 60,
    rating: 4.6,
    description: "Stuffed paratha with butter.",
    image: "26.webp",
    },
  {
    id: 27,
    name: "Onion Rings",
    category: "Fast Food",
    price: 85,
    rating: 4.3,
    description: "Fried battered onion slices.",
    image: "27.webp",
  },
  {
    id: 28,
    name: "Ice Cream Sundae",
    category: "Dessert",
    price: 140,
    rating: 4.7,
    description: "Scoops with toppings & syrup.",
    image: "28.webp",
  },
  {
    id: 29,
    name: "Milk Tea",
    category: "Beverages",
    price: 30,
    rating: 4.4,
    description: "Hot chai with milk and sugar.",
    image: "29.webp",
  },
  {
    id: 30,
    name: "Lassi",
    category: "Beverages",
    price: 40,
    rating: 4.6,
    description: "Sweet curd-based drink.",
    image: "30.webp"
  },
  {
    id: 31,
    name: "Garlic Bread",
    category: "Fast Food",
    price: 99,
    rating: 4.2,
    description: "Toasted bread with garlic butter.",
    image: "31.jpg",
  },
  {
    id: 32,
    name: "Chowmein",
    category: "Chinese",
    price: 130,
    rating: 4.3,
    description: "Stir-fried noodles with sauce.",
    image: "32.jpg",
  },
  {
    id: 33,
    name: "Corn Soup",
    category: "Chinese",
    price: 90,
    rating: 4.1,
    description: "Thick soup with corn & veggies.",
    image: "33.jpg",
  },
  {
    id: 34,
    name: "Dhokla",
    category: "Indian",
    price: 50,
    rating: 4.6,
    description: "Steamed savory snack from Gujarat.",
    image: "34.webp",
  },
  {
    id: 35,
    name: "Rasgulla",
    category: "Dessert",
    price: 40,
    rating: 4.7,
    description: "Soft syrupy Bengali sweet.",
    image: "35.webp",
  },
  {
    id: 36,
    name: "Pav Bhaji",
    category: "Indian",
    price: 100,
    rating: 4.5,
    description: "Spicy veg mash with buttered pav.",
    image: "36.webp",
  },
  {
    id: 37,
    name: "Momo",
    category: "Chinese",
    price: 110,
    rating: 4.2,
    description: "Steamed dumplings with chutney.",
    image: "37.webp",
  },
  {
    id: 38,
    name: "Thali",
    category: "Indian",
    price: 299,
    rating: 4.6,
    description: "Full Indian platter with curries.",
    image:"38.webp",
  },
  {
    id: 39,
    name: "Chai Biscuit Combo",
    category: "Beverages",
    price: 40,
    rating: 4.3,
    description: "Tea served with cookies.",
    image: "39.webp",
  },
  {
    id: 40,
    name: "Nachos",
    category: "Fast Food",
    price: 140,
    rating: 4.4,
    description: "Crispy chips with cheese & salsa.",
    image:"40.webp",
  },
  {
    id: 41,
    name: "Pasta Alfredo",
    category: "Italian",
    price: 200,
    rating: 4.5,
    description: "Creamy white sauce pasta.",
    image: "41.webp",
  },
  {
    id: 42,
    name: "Cheese Sandwich",
    category: "Fast Food",
    price: 90,
    rating: 4.2,
    description: "Grilled sandwich with cheese.",
    image: "42.webp",
  },
  {
    id: 43,
    name: "Malai Kofta",
    category: "Indian",
    price: 230,
    rating: 4.5,
    description: "Soft koftas in creamy gravy.",
    image:"43.webp",
  },
  {
    id: 44,
    name: "Chilli Paneer",
    category: "Chinese",
    price: 190,
    rating: 4.4,
    description: "Paneer cubes in spicy sauce.",
    image: "44.webp",
  },
  {
    id: 45,
    name: "Custard",
    category: "Dessert",
    price: 70,
    rating: 4.3,
    description: "Fruity custard with jelly.",
    image: "45.webp",
  },
  {
    id: 46,
    name: "jira Rise",
    category: "Indian",
    price: 250,
    rating: 4.8,
    description: "Jira Rise with Butter Milk",
    image: "/2.avif",
  },
  {
    id: 47,
    name: "Medu Vada",
    category: "South Indian",
    price: 40,
    rating: 4.4,
    description: "Crispy lentil donut snack.",
    image: "47.webp",
  },
  {
    id: 48,
    name: "Jeera Rice",
    category: "Indian",
    price: 90,
    rating: 4.2,
    description: "Simple rice flavored with cumin.",
    image: "/48.webp",
  },
  {
    id: 49,
    name: "Pani Puri",
    category: "Indian",
    price: 40,
    rating: 4.8,
    description: "Tangy and spicy street snack.",
    image: "49.webp",
  },
  {
    id: 50,
    name: "Hot Chocolate",
    category: "Beverages",
    price: 80,
    rating: 4.7,
    description: "Warm drink with melted chocolate.",
    image: "50.avif",
  },
];

function Menus() {
  const [products, setProducts] = useState(productsData);
  const [search, setSearch] = useState("");

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 🔎 Search filter
  useEffect(() => {
    if (search.trim() === "") {
      setProducts(productsData);
    } else {
      const filtered = productsData.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [search]);

  // 🛒 Add to Cart
  const handleClick = (p) => {
    addToCart(p);
    toast.success(`${p.name} added to cart! 🛒`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  return (
    <>
      <div className="main">
        <div className="back-main">
          <div className="order-flex">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search Food Item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <h2 className="count">Available Items: {products.length}</h2>
              <button onClick={() => navigate("/cart")} className="order1">
                Your Order
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.image} alt={p.name} className="product-img" />
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>{p.category}</p>
                  <p>{p.description}</p>
                  <p>⭐ {p.rating}</p>
                  <strong>₹ {p.price}</strong>
                  <div>
                    <Button
                      onClick={() => handleClick(p)}
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        color: "#000",
                        padding: "12px",
                      }}
                      className="order"
                    >
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}

export default Menus;
