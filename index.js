const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const exp = require("constants");
//carregando o cabeçalho do html em outras páginas
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//arquivos estaticos
app.use('/public', express.static('public/css/bootstrap'))
app.use(express.static('public'));
//rota principal
app.get('/', function(req, res){
    Post.findAll().then(function(posts){
        posts=posts.map((post)=>{return post.toJSON()})
        res.render('home',{posts: posts})
    });
});
//rota para o cadastro
app.get('/cad', function(req, res){
res.render('formulario');
});
//fazendo a inserção no banco
app.post('/add', function(req, res){
Post.create({
titulo: req.body.titulo,
conteudo: req.body.conteudo
}).then(function(){
//redirecionando para home com o barra
res.redirect('/')
}).catch(function(erro){
res.send('"Houve um erro: '+erro);
});
});
//exclesão de dados
app.get('/deletar/:id', function(req,res){
    Post.destroy({where:{'id':req.params.id}}).then(function(){
        res.redirect('/');
    }).catch(function(erro){
        res.send("está postagem nao existe");
    });
});
//rota para alterar
app.get('/alterar/:id', function(req,res){
    Post.findAll({where: {'id': req.params.id}}).then(function(posts){
        posts=posts.map((post)=>{return post.toJSON()});
        res.render('alterar', {posts: posts})
    });
});
//fazendo a alteração no banco
app.post('/update', function(req,res){
    Post.update({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo},
        {where: {id: req.body.id}
    }).then(function(){
        res.redirect('/');
    }).catch(function(erro){
        res.send("Está postagem não existe "+erro);
    });
});
app.listen(8081, function(){
console.log("Servidor Rodando");
});