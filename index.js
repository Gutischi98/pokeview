const express = require('express');
const axios = require('axios');
const handlebars = require('express-handlebars');
// const path = require('path');

const port = 3000;
const app = express();

app.set('view engine', 'handlebars');

const hbs = handlebars.create({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

app.engine('handlebars', hbs.engine)


app.use(express.static('public'))
app.use('/bootstrap', express.static( __dirname +'/node_modules/bootstrap/dist/css') )
app.use('/public',express.static( __dirname +'/public') )


async function getPokemons() {
  try {
    // const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=5');
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const urls = response.data.results.map((pokemon) => { return pokemon.url });
    const resultadoFinal = await Promise.all(urls.map(url => axios.get(url))).then(allResultados => {
      const arrayResultados = allResultados.map(resultado => {
        return {
          name: resultado.data.name,
          img: resultado.data.sprites.other.dream_world.front_default
        }
      })
      // console.log(arrayResultados)
      return arrayResultados;
    }).catch((err) => {
      console.log("ERROR DE PROMISE ALL ", err)
    });
    return resultadoFinal;
    //   console.log(pokemons);
  } catch (error) {
    console.error(error);
  }
}


app.get("/", (req, res) => {
  res.render('home');
})


app.get("/pokemons", (req, res) => {
  getPokemons().then((pokemons) => {
    res.render('pokemons', { dataCard: [{ pokemons }] });
  }).catch((error) => {
    console.error(error);
    res.status(500).send("Error al obtener los pokemons");
  });
});

app.listen(port, () => {
  console.log("SERVIDOR ABIERTO:d")
})
// getPokemons().then((pokemons) => {
//   console.log("Aaaaaaaaaaaaaaaaaaaaa:",pokemons);

// })

// .then((pokemons) => {
  // res.write(`<p>${pokemons}</p>`);
