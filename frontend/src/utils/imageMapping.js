// Image mapping utility for categories and products
// Using direct imports for Vite compatibility

import groceryImage from '../assets/CATEGORIES/grocery and staples.jpg';
import fruitsImage from '../assets/CATEGORIES/fruits and vegetables.jpg';
import meatImage from '../assets/CATEGORIES/meat and poultty.webp';
import dairyImage from '../assets/CATEGORIES/dariy and eggs.webp';
import bakeryImage from '../assets/CATEGORIES/bakery items.jpg';
import beveragesImage from '../assets/CATEGORIES/beverages.jpg';
import snacksImage from '../assets/CATEGORIES/snacks and confectionery.jpg';
import frozenImage from '../assets/CATEGORIES/frozen items.jpeg';
import householdImage from '../assets/CATEGORIES/Household and cleaning.jpg';
import personalCareImage from '../assets/CATEGORIES/personal care.jpg';
import babyCareImage from '../assets/CATEGORIES/baby care.jpg';
import electronicsImage from '../assets/CATEGORIES/electronic items.jpg';
import fashionImage from '../assets/CATEGORIES/Fashion items.webp';
import kitchenImage from '../assets/CATEGORIES/kitchen appliances.jpg';

const categoryImages = {
  'groceries & staples': groceryImage,
  groceries: groceryImage,
  'fruits & vegetables': fruitsImage,
  produce: fruitsImage,
  'meat & poultry': meatImage,
  meat: meatImage,
  'dairy & eggs': dairyImage,
  dairy: dairyImage,
  bakery: bakeryImage,
  beverages: beveragesImage,
  'snacks & confectionery': snacksImage,
  snacks: snacksImage,
  'frozen food': frozenImage,
  frozen: frozenImage,
  'household & cleaning': householdImage,
  household: householdImage,
  'personal care': personalCareImage,
  'baby care': babyCareImage,
  electronics: electronicsImage,
  'fashion & clothing': fashionImage,
  fashion: fashionImage,
  'home & kitchen': kitchenImage,
  kitchen: kitchenImage,
};

// Product images
import basmatiRice from '../assets/ITEMS/Basmati Rice 5kg.jpg';
import sunflowerOil from '../assets/ITEMS/Sunflower Cooking Oil 1L.jpg';
import flour from '../assets/ITEMS/All-Purpose Flour 2kg.jpg';
import lentils from '../assets/ITEMS/Red Lentils 1kg.webp';
import spices from '../assets/ITEMS/Mixed Spices Pack.jpg';
import bananas from '../assets/ITEMS/Fresh Bananas 1kg.jpg';
import tomatoes from '../assets/ITEMS/Tomatoes 1kg.webp';
import potatoes from '../assets/ITEMS/Potatoes 2kg.jpg';
import salad from '../assets/ITEMS/Mixed Salad Pack.jpg';
import oranges from '../assets/ITEMS/Oranges 1kg.jpg';
import chickenBreast from '../assets/ITEMS/Chicken Breast 1kg.jpg';
import beefMince from '../assets/ITEMS/Beef Mince 500g.webp';
import chickenNuggets from '../assets/ITEMS/Frozen Chicken Nuggets 1kg.png';
import milk from '../assets/ITEMS/Fresh Milk 1L.jpg';
import eggs from '../assets/ITEMS/Eggs 12 Pack.jpg';
import cheddar from '../assets/ITEMS/Cheddar Cheese 200g.webp';
import yogurt from '../assets/ITEMS/Yogurt 500g.jpg';
import whiteBread from '../assets/ITEMS/White Bread Loaf.webp';
import croissants from '../assets/ITEMS/Croissants 4 Pack.jpg';
import wheatBread from '../assets/ITEMS/Whole Wheat Bread.jpg';
import cola from '../assets/ITEMS/Cola 2L.jpg';
import orangeJuice from '../assets/ITEMS/Orange Juice 1L.jpg';
import water from '../assets/ITEMS/Mineral Water 6 Pack.jpg';
import tea from '../assets/ITEMS/Black Tea 100 Bags.jpg';
import chips from '../assets/ITEMS/Potato Chips Family Pack.jpg';
import chocolate from '../assets/ITEMS/Chocolate Bar Multipack.jpg';
import biscuits from '../assets/ITEMS/Biscuits Assorted 400g.jpg';
import fries from '../assets/ITEMS/Frozen French Fries 1kg.png';
import mixedVeg from '../assets/ITEMS/Frozen Mixed Vegetables 500g.webp';
import iceCream from '../assets/ITEMS/Ice Cream 1L.jpg';
import detergent from '../assets/ITEMS/Laundry Detergent 3kg.jpg';
import dishSoap from '../assets/ITEMS/Dish Soap 750ml.jpg';
import toiletPaper from '../assets/ITEMS/Toilet Paper 12 Rolls.webp';
import shampoo from '../assets/ITEMS/Shampoo 400ml.webp';
import toothpaste from '../assets/ITEMS/Toothpaste Twin Pack.png';
import soap from '../assets/ITEMS/Soap Bar 4 Pack.jpg';
import diapers from '../assets/ITEMS/Baby Diapers Size 3 (48).jpg';
import wipes from '../assets/ITEMS/Baby Wipes 3 Pack.jpg';
import bluetoothSpeaker from '../assets/ITEMS/Bluetooth Speaker.jpg';
import kettle from '../assets/ITEMS/Electric Kettle 1.7L.webp';
import ledBulb from '../assets/ITEMS/LED Bulb 4 Pack.jpg';
import tshirt from '../assets/ITEMS/Men Cotton T-Shirt.jpg';
import kurti from '../assets/ITEMS/Women Kurti.webp';
import schoolShoes from '../assets/ITEMS/Kids School Shoes.jpg';
import fryingPan from '../assets/ITEMS/Non-Stick Frying Pan.jpg';
import plates from '../assets/ITEMS/Dinner Plates Set of 6.jpg';
import containers from '../assets/ITEMS/Food Storage Containers 10pc.jpg';

const productImages = {
  'basmati rice 5kg': basmatiRice,
  'sunflower cooking oil 1l': sunflowerOil,
  'all-purpose flour 2kg': flour,
  'red lentils 1kg': lentils,
  'mixed spices pack': spices,
  'fresh bananas 1kg': bananas,
  'tomatoes 1kg': tomatoes,
  'potatoes 2kg': potatoes,
  'mixed salad pack': salad,
  'oranges 1kg': oranges,
  'chicken breast 1kg': chickenBreast,
  'beef mince 500g': beefMince,
  'frozen chicken nuggets 1kg': chickenNuggets,
  'fresh milk 1l': milk,
  'eggs 12 pack': eggs,
  'cheddar cheese 200g': cheddar,
  'yogurt 500g': yogurt,
  'white bread loaf': whiteBread,
  'croissants 4 pack': croissants,
  'whole wheat bread': wheatBread,
  'cola 2l': cola,
  'orange juice 1l': orangeJuice,
  'mineral water 6 pack': water,
  'black tea 100 bags': tea,
  'potato chips family pack': chips,
  'chocolate bar multipack': chocolate,
  'biscuits assorted 400g': biscuits,
  'frozen french fries 1kg': fries,
  'frozen mixed vegetables 500g': mixedVeg,
  'ice cream 1l': iceCream,
  'laundry detergent 3kg': detergent,
  'dish soap 750ml': dishSoap,
  'toilet paper 12 rolls': toiletPaper,
  'shampoo 400ml': shampoo,
  'toothpaste twin pack': toothpaste,
  'soap bar 4 pack': soap,
  'baby diapers size 3 (48)': diapers,
  'baby wipes 3 pack': wipes,
  'bluetooth speaker': bluetoothSpeaker,
  'electric kettle 1.7l': kettle,
  'led bulb 4 pack': ledBulb,
  'men cotton t-shirt': tshirt,
  'women kurti': kurti,
  'kids school shoes': schoolShoes,
  'non-stick frying pan': fryingPan,
  'dinner plates set of 6': plates,
  'food storage containers 10pc': containers,
};

export const getCategoryImage = (categoryName) => {
  const normalizedName = categoryName?.toLowerCase().trim();
  return categoryImages[normalizedName] || null;
};

export const getProductImage = (productName) => {
  const normalizedName = productName?.toLowerCase().trim();
  return productImages[normalizedName] || null;
};

export default {
  getCategoryImage,
  getProductImage,
};
