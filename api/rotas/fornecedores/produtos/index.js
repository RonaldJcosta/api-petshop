const roteador = require('express').Router({mergeParams: true});
const Tabela = require('./TabelaProduto');
const Produto = require('./Produto');
const Serializador = require('../../../Serializador').SerializadorProduto;

roteador.get('/', async (requisicao, resposta) => {
   const produtos = await Tabela.listar(requisicao.fornecedor.id);
   const serializador = new Serializador(resposta.getHeader('Content-Type'));

   resposta.send(serializador.serializar(produtos));
});

roteador.post('/', async (requisicao, resposta, proximo) => {
   try {

      const idFornecedor = requisicao.fornecedor.id;
      const corpo = requisicao.body;
      const dados = Object.assign({}, corpo, {fornecedor: idFornecedor});
      const produto = new Produto(dados);

      await produto.criar();

      const serializador = new Serializador(resposta.getHeader('Content-Type'));
      resposta.status(201).send(serializador.serializar(produto));
   } catch (err) {
      proximo(err);
   }
});

roteador.delete('/:id', async (requisicao, resposta) => {
   const dados = {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id
   }
   const produto = new Produto(dados);
   await produto.apagar();

   resposta.status(204).end();


});

roteador.get('/:id', async (requisicao, resposta) => {

   try {

      const dados = {
         id: requisicao.params.id,
         fornecedor: requisicao.fornecedor.id
      }
      const produto = new Produto(dados);
      await produto.carregar();

      const serializador = new Serializador(resposta.getHeader('Content-Type'), [
         'preco',
         'estoque',
         'fornecedor',
         'dataCriacao',
         'dataAtualizacao',
         'versao'
      ]);
      resposta.send(serializador.serializar(produto))

   } catch (err) {
      proximo(err);
   }
})


module.exports = roteador
