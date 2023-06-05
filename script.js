const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealid="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}


// Event listeners
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click' , e=>{
  let mealInfo;

  if(e.target.classList){
    if(e.target.classList.contains('meal-info')){
      mealInfo = e.target;
    }
    else {
      mealInfo = false;
    }
  } 

  if(mealInfo){
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }

})


// Get Meal By Id
function getMealById(mealID){
 
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res => res.json())
  .then(data =>{
   const meal = data.meals[0];
    addMealToDom(meal);
  })
}


// Add the Meal to the Dom
function addMealToDom(meal){
  const ingredient = [];

  for(let i = 1 ; i <= 20 ; i++){
    if(meal[`strIngredient${i}`]){
      ingredient.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}">
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredient</h2>
      <ul>
        ${ingredient.map(x =>`<li>${x}</li>`).join('')}
      </ul>
    </div>
  </div>
  
  `

}

