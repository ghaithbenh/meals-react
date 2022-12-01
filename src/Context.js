import React, { useState, useContext, useEffect } from "react";
const AppContext = React.createContext();

const AllMealsUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RandomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

const AppProvider = ({ children }) => {
  const getFavoritesFromLocalStorage = () => {
    let favorites = localStorage.getItem("favorites");
    if (favorites) {
      favorites = JSON.parse(localStorage.getItem("favorites"));
    } else {
      favorites = [];
    }
    return favorites;
  };
  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fetchMeals = async (url) => {
    setLoading(true);
    try {
      const data = await fetch(url);
      const res = await data.json();
      // setMeals(res.data);
      setMeals(res.meals);
      // console.log(res);
    } catch (error) {
      console.log(error.response);
    }
    setLoading(false);
  };
  //... yani tkhali l beki w tbadel haja tzid or tnakes
  const addToFavorites = (idMeal) => {
    const meal = meals.find((meal) => meal.idMeal === idMeal);
    const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
    if (alreadyFavorite) return;
    const updatedFavorites = [...favorites, meal];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (idMeal) => {
    //filter yani tkharg kn hajet li hachtek bhm mil array or hajet li hachtkch bhm
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  }; //filter yani tkharg kn hajet li hachtek bhm mil array or hajet li hachtkch bhm
  const selectMeal = (idMeal, favoriteMeal) => {
    let meal;
    meal = meals.find((meal) => meal.idMeal === idMeal);
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const fetchRandomMeal = () => {
    fetchMeals(RandomMealUrl);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    fetchMeals(AllMealsUrl);
  }, []);
  useEffect(() => {
    if (!searchTerm) return;
    fetchMeals(`${AllMealsUrl}${searchTerm}`);
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        meals,
        setSearchTerm,
        fetchRandomMeal,
        showModal,
        selectMeal,
        selectedMeal,
        closeModal,
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
