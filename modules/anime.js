const auth = require("../helpers/auth");
const amino = require("amino.js");
const fetch = require("node-fetch")
const fs = require('fs');
const translate = require('node-google-translate-skidz');
const anilist = require("../helpers/anilist");

let timestamp = Math.floor(Date.now() / 1000)

async function reqCharacter(req, receiver){
    let characterMatch = req.match(/\/character (.*)/)

    await anilist.getCharacter(characterMatch[1])
        .then(async res=>{
            let textFixed = res
        .description
        .replace(/<br>\\*/g, `
        `)
        .replace(/<br \/>\\*/g, `
        `)
        .replace(/<p>\\*/g, '')
        .replace(/<\/p>\\*/g, '')
        .replace(/<strong>\\*/g, '『 ')
        .replace(/<\/strong>\\*/g, ' 』')
        
    fetch(res.image.large)
        .then(image => {
            const dest = fs.createWriteStream(`${timestamp}.jpg`);
            image.body.pipe(dest);
            dest.on("finish", async function(){
                await amino.sendImage(
                    auth.amino.community,
                    receiver,
                    './' + timestamp + '.jpg'
                )
            })
        });
    
    /*el parser de texto del cliente de Amino es la cosa más extraña que he visto*/

    if(res.name.last == null && res.name.native != null) {

        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Nombre: ${res.name.first}
Romaji: ${res.name.native}
            `
        )

    }

    else if(res.name.last == null && res.name.native == null){

        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Nombre: ${res.name.first}
            `
        )

    }

    else {

        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Nombre: ${res.name.first} ${res.name.last}
Romaji: ${res.name.native}
            `
        )
        
    }

    translate({
        text: textFixed,
        source: 'en',
        target: 'es'
      }, async function(result) {
          await amino.sendChat(auth.amino.community, receiver, result.translation)
      });

    })
    .catch(async function(){
        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Personaje no encontrado
            `
        )
    })
    
}

async function reqRandomManga(req,receiver){
    const categories = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", 
    "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller","action", "adventure", "comedy", "drama", "ecchi", "fantasy", "horror", "mahou shoujo", "mecha", "music", 
    "mystery", "psychological", "romance", "sci-fi", "slice of life", "sports", "supernatural", "thriller"]
    let randomMangaMatch = req.match(/\/randomManga (.*)/)

    if(categories.includes(randomMangaMatch[1])){

        let res = await anilist.getRandomManga(randomMangaMatch[1])
        let textFixed = res
        .description
        .replace(/<br>\\*/g, `
        `)

    fetch(res.coverImage.large)
        .then(res => {
            const dest = fs.createWriteStream(`${timestamp}.jpg`);
            res.body.pipe(dest);
            dest.on("finish", async function(){
                await amino.sendImage(
                    auth.amino.community,
                    receiver,
                    './' + timestamp + '.jpg'
                )
            })
        });
    
    await amino.sendChat(
        auth.amino.community,
        receiver,
        `
        Nombre: ${res.title.native}
Romaji: ${res.title.romaji}
Inicio: ${res.startDate.day}-${res.startDate.month}-${res.startDate.year}
Final: ${res.endDate.day}-${res.endDate.month}-${res.endDate.year}
Capítulos: ${res.chapters}
Volumenes: ${res.volumes}
        `
    )

    translate({
        text: textFixed,
        source: 'en',
        target: 'es'
      }, async function(result) {
          await amino.sendChat(auth.amino.community, receiver, result.translation)
      });
    }

    else {
        await amino.sendChat(
            auth.amino.community,
            receiver,
            'categoría no encontrada, las categorías son: Action, Adventure, Comedy, Drama, Ecchi, Fantasy, Horror, Mahou Shoujo, Mecha, Music, Mystery, Psychological, Romance, Sci-Fi, Slice of Life, Sports, Supernatural, Thriller'
        )
    }

}

async function reqRandomAnime(req,receiver){
    const categories = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", 
    "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller","action", "adventure", "comedy", "drama", "ecchi", "fantasy", "horror", "mahou shoujo", "mecha", "music", 
    "mystery", "psychological", "romance", "sci-fi", "slice of life", "sports", "supernatural", "thriller"]
    let randomAnimeMatch = req.match(/\/randomAnime (.*)/)

    if(categories.includes(randomAnimeMatch[1])){
        let res = await anilist.getRandomAnime(randomAnimeMatch[1])
        let textFixed = res
            .description
            .replace(/<br>\\*/g, `
            `)

    fetch(res.coverImage.large)
        .then(image => {
            const dest = fs.createWriteStream(`${timestamp}.jpg`);
            image.body.pipe(dest);
            dest.on("finish", async function(){
                await amino.sendImage(
                    auth.amino.community,
                    receiver,
                    './' + timestamp + '.jpg'
                )
            })
        });
        
        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Nombre: ${res.title.native}
Romaji: ${res.title.romaji}
Inicio: ${res.startDate.day}-${res.startDate.month}-${res.startDate.year}
Final: ${res.endDate.day}-${res.endDate.month}-${res.endDate.year}
Episodios: ${res.episodes}
Duración: ${res.duration} minutos
            `
        )

        translate({
            text: textFixed,
            source: 'en',
            target: 'es'
          }, async function(result) {
              await amino.sendChat(auth.amino.community, receiver, result.translation)
          });
    }

    else {
        await amino.sendChat(
            auth.amino.community,
            receiver,
            'categoría no encontrada, las categorías son: Action, Adventure, Comedy, Drama, Ecchi, Fantasy, Horror, Mahou Shoujo, Mecha, Music, Mystery, Psychological, Romance, Sci-Fi, Slice of Life, Sports, Supernatural, Thriller'
        )
    }
}

async function reqManga(req,receiver){
    let mangaMatch = req.match(/\/manga (.*)/)
    await anilist.getManga(mangaMatch[1])
        .then(async res=>{
            let textFixed = res
        .description
        .replace(/<br>\\*/g, `
        `)

    fetch(res.coverImage.large)
        .then(image => {
            const dest = fs.createWriteStream(`${timestamp}.jpg`);
            image.body.pipe(dest);
            dest.on("finish", async function(){
                await amino.sendImage(
                    auth.amino.community,
                    receiver,
                    './' + timestamp + '.jpg'
                )
            })
        });
    
    await amino.sendChat(
        auth.amino.community,
        receiver,
        `
        Nombre: ${res.title.native}
Romaji: ${res.title.romaji}
Inicio: ${res.startDate.day}-${res.startDate.month}-${res.startDate.year}
Final: ${res.endDate.day}-${res.endDate.month}-${res.endDate.year}
Capítulos: ${res.chapters}
Volumenes: ${res.volumes}
        `
    )

    translate({
        text: textFixed,
        source: 'en',
        target: 'es'
      }, async function(result) {
          await amino.sendChat(auth.amino.community, receiver, result.translation)
      });
    })
    .catch(async function(){
        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Manga no encontrado
            `
        )
    })
}

/* orden para buscar anime */

async function reqAnime(req,receiver){
    let animeMatch = req.match(/\/anime (.*)/)

    await anilist.getAnime(animeMatch[1])
        .then(async res=>{
            let textFixed = res
        .description
        .replace(/<br>\\*/g, `
        `)

    fetch(res.coverImage.large)
        .then(image => {
            const dest = fs.createWriteStream(`${timestamp}.jpg`);
            image.body.pipe(dest);
            dest.on("finish", async function(){
                await amino.sendImage(
                    auth.amino.community,
                    receiver,
                    './' + timestamp + '.jpg'
                )
            })
        });
        
        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Nombre: ${res.title.native}
Romaji: ${res.title.romaji}
Inicio: ${res.startDate.day}-${res.startDate.month}-${res.startDate.year}
Final: ${res.endDate.day}-${res.endDate.month}-${res.endDate.year}
Episodios: ${res.episodes}
Duración: ${res.duration} minutos
            `
        )

        translate({
            text: textFixed,
            source: 'en',
            target: 'es'
          }, async function(result) {
              await amino.sendChat(auth.amino.community, receiver, result.translation)
          });
    })
    .catch(async function(){
        await amino.sendChat(
            auth.amino.community,
            receiver,
            `
            Anime no encontrado
            `
        )
    })
    
}

module.exports = {
    reqCharacter: reqCharacter,
    reqAnime: reqAnime,
    reqManga: reqManga,
    reqRandomAnime: reqRandomAnime,
    reqRandomManga: reqRandomManga
}