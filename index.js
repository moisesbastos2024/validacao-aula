const express = require('express');
//importa o mongodb em MongoCLient
const { MongoClient, ObjectId } = require('mongodb');
// configura a url do banco
const url="mongodb://127.0.0.1:27017";
// nome do banco de dados
const dbName = "backend-abril-25";
// cria um cliente com a url criada
const client = new MongoClient(url);

async function main(){

  console.info("Conectando ao banco de dados...");
  await client.connect();
  console.info("Banco de dados conectado com sucesso!!!");

  const db = client.db(dbName);
  const collection = db.collection("herois");

  const app = express()

  //habilitar o processamento de JSON
  app.use(express.json());

  // endpoint inicial
  app.get('/', function (req, res) {
    res.send('Hello World!!!')
  })

  //Read All -> [GET] /herois
  app.get("/herois", async function (req,res){
    const itens = await collection.find().toArray();
    res.send(itens)
  })

  //Create -> [POST] /herois
  app.post("/herois", async function(req,res){
    
    //busca o item completo e insere o item na collection
    const item = req.body;
    await collection.insertOne(item);
    //envia o objeto na resposta 
    res.send (item)
  })

  // Read by Id -> [GET] /herois/:id
  app.get("/herois/:id", async function (req,res){
    //pegamos inicialmente o parametro de rota (id)
    const id = req.params.id;
    //buscamos a informação collection
    const item = await collection.findOne({
      _id: new ObjectId(id),
    })
    //exibimos o item na resposta
    if (item==null)
      res.send("item não encontrado");
    else 
      res.send(item);

  })

  // Update -> [PUT] /herois/:id
  app.put("/herois/:id", async function(req,res){
    //pegamos inicialmente o parametro de rota (id)
    const id = req.params.id;
    // extrai o objeto da requisição 
    const item = req.body;
    //atualizamos na collection
    await collection.updateOne(
      { _id: new ObjectId(id)},
      { $set: item}
    )
    //exibimos o item na resposta
    res.send(item);
  })

  // Delete -> [DELETE] /herois/:id
  app.delete("/herois/:id", async function(req,res){
    //pegamos inicialmente o parametro de rota (id) que queremos remover
    const id = req.params.id;

    //removemos da collection
    await collection.deleteOne(
      { _id: new ObjectId(id) },
    );

    res.send("Item Removido com Sucesso");
  })

  app.listen(3000);

}

main();