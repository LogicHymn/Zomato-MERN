/**
 * Central Demo Dishes & Reels Data
 * Reusable across User Dashboard, Dish Details (/dish/:id), and Checkout
 */
export const DEMO_DISHES = [
  {
    id: "101",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 269,
    restaurantName: "Spice Garden Kitchen",
    status: "Available",
    isVeg: true,
    description:
      "Tender cottage cheese cubes simmered in velvety tomato makhani gravy enriched with churned butter and fragrant fenugreek leaves.",
    ingredients: "Cottage cheese (paneer), fresh cream, ripe tomatoes, butter, cashew paste, kasuri methi, garam masala.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "460 kcal",
      protein: "22 g",
      carbs: "34 g",
      fat: "28 g",
    },
  },
  {
    id: "102",
    name: "Hyderabadi Dum Biryani",
    category: "Biryani",
    price: 349,
    restaurantName: "Royal Darbar Kitchen",
    status: "Available",
    isVeg: false,
    description:
      "Authentic slow-dum cooked long-grain basmati rice with marinated tender cuts, caramelized brown onions, fried mint, and saffron milk.",
    ingredients: "Basmati rice, tender cuts, yogurt marinade, saffron strands, whole star anise, fried shallots, pure ghee.",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "580 kcal",
      protein: "32 g",
      carbs: "62 g",
      fat: "22 g",
    },
  },
  {
    id: "103",
    name: "Artisan Truffle Burger",
    category: "Burgers",
    price: 219,
    restaurantName: "Burger Lab",
    status: "Available",
    isVeg: false,
    description:
      "Toasted golden brioche bun, double flame-grilled smash patty, melted aged English cheddar, caramelized onions, and house truffle emulsion.",
    ingredients: "Grilled patty, brioche bun, aged cheddar, truffle oil, arugula, balsamic onion jam.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "540 kcal",
      protein: "28 g",
      carbs: "46 g",
      fat: "26 g",
    },
  },
  {
    id: "104",
    name: "Butter Ghee Roast Dosa",
    category: "South Indian",
    price: 159,
    restaurantName: "Madras Tiffin Room",
    status: "Available",
    isVeg: true,
    description:
      "Paper-thin crispy golden rice crepe roasted in pure Malnad cow ghee, paired with spiced potato masala, vegetable sambar, and 3 chutneys.",
    ingredients: "Fermented lentils & rice batter, pure cow ghee, tempered potatoes, mustard seeds, curry leaves.",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "380 kcal",
      protein: "10 g",
      carbs: "54 g",
      fat: "14 g",
    },
  },
  {
    id: "105",
    name: "Shahi Kesar Gulab Jamun",
    category: "Dessert",
    price: 119,
    restaurantName: "Mithai Mahal",
    status: "Available",
    isVeg: true,
    description:
      "Deep golden reduced-milk dumplings steeped in warm saffron and cardamom syrup, garnished with crushed Iranian pistachios.",
    ingredients: "Khoya / mawa, saffron, cardamom, sugar syrup, rose water, sliced pistachios.",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "320 kcal",
      protein: "6 g",
      carbs: "48 g",
      fat: "12 g",
    },
  },
  {
    id: "106",
    name: "Alphonso Mango Lassi",
    category: "Beverages",
    price: 89,
    restaurantName: "Spice Garden Kitchen",
    status: "Available",
    isVeg: true,
    description:
      "Thick artisanal hand-churned yogurt blended with authentic Ratnagiri Alphonso mango pulp, green cardamom, and honey drizzle.",
    ingredients: "Whole milk curd, Alphonso mango pulp, crushed ice, cardamom, honey.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    macros: {
      calories: "210 kcal",
      protein: "7 g",
      carbs: "32 g",
      fat: "6 g",
    },
  },
];

export const DEMO_REELS = [
  {
    id: "reel_1",
    restaurantName: "Spice Garden",
    dishName: "Sizzling Paneer Tikka",
    duration: "0:24",
    likes: "1.4k",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "reel_2",
    restaurantName: "Royal Darbar",
    dishName: "Dum Biryani Unsealing",
    duration: "0:30",
    likes: "3.8k",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "reel_3",
    restaurantName: "Burger Lab",
    dishName: "Cheese Melt Pour",
    duration: "0:18",
    likes: "2.1k",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  },
];
