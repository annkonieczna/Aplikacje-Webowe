let table = document.getElementById("list")
//Wypisz nazwę (name przepisu który ma najwięcej składników )


fetch("https://dummyjson.com/recipes")
    .then(res => res.json())
    .then(data => {
       
        const recipes = data.recipes;

        
        let maxRecipe = recipes.reduce((max, recipe) =>
            recipe.ingredients.length > max.ingredients.length ? recipe : max
        );

        console.log(maxRecipe.name);

        
        table.innerHTML = `${maxRecipe.name}`;
    });