import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
        //Loading data
        recipeView.renderSpinner();

        resultsView.update(model.getSearchResultsPage());

        bookmarksView.update(model.state.bookmarks);
      
      //Loading recipe
      await model.loadRecipe(id);

      //Rendering data in recipe container
    recipeView.render(model.state.recipe);

  }catch (err){
    alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try {
      resultsView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();
    if(!query) return;

    //Load results
    await model.loadSearchResults(query);

    //Render results
    resultsView.render(model.getSearchResultsPage());

    //Render pagination btns
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage){
  //Render new res
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render initial pagination btns  
  paginationView.render(model.state.search);
};

const controlServings = function(newServings){
  //Uppdate the recipe servings
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

};

const controlAddBookmark = function(){
  //add or del
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const contrilAddRecipe = async function (newRecipe){
  try{
    addRecipeView.renderSpinner();

  await model.uploadRecipe(newRecipe);

  recipeView.render(model.state.recipe);

  addRecipeView.renderMessage();

  bookmarksView.render(model.state.bookmarks);

  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  setTimeout(function(){
    // addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);

  } catch(err){
    addRecipeView.renderError(err.message);
  }
}




const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHanlderUpload(contrilAddRecipe);
};


init();