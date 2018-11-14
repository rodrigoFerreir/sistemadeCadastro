const express = require('express')
const app = express()
const axios = require('axios')
const bodyPaser = require('body-parser')

app.set('view engine', 'ejs')
app.use(bodyPaser.urlencoded())

const port = process.env.PORT || 3000



app.get('/', async(req, res)=>{// pegando usuario e senha para o bd
    const content = await axios.get('https://sistema-de-notas-teste.firebaseio.com/teste.json')
    
    console.log(content.data)
    res.render('index', {u: content.data })
    res.render('index', {s: content.data})
})

app.get('/usuario/novo', (req, res)=>{
    res.render('usuario/novo')
})

app.post('/usuario/novo', async(req, res)=>{ //mandando usuario e senha para o bd
    await axios.post('https://sistema-de-notas-teste.firebaseio.com/usuario.json',{
        usuario: req.body.usuario,
        senha: req.body.senha
    })
    res.redirect('/usuario')
})

app.get('/usuario', async(req, res)=>{
    const content = await axios.get('https://sistema-de-notas-teste.firebaseio.com/usuario.json')
    if(content.data){
        const usuarios = Object
                                .keys(content.data)
                                .map( key =>{
                                    return {
                                        id: key,
                                        ...content.data[key]
                                    }
                                }) 

        res.render('usuario/index', {usuario: usuarios})
    }else{
        res.render('usuario/index', {usuario: []})
    }
})

app.get('/usuario/excluir/:id',async(req, res)=>{//excluindo itens do bd
    await axios.delete(`https://sistema-de-notas-teste.firebaseio.com/usuario/${req.params.id}.json`)//cuidado com as letras
    res.redirect('/usuario')
})

app.listen(port,(err)=>{
    if (err){
        console.log('erro')
    }else{
    console.log('SISTEMA EM USO on port:', port)
    }
})