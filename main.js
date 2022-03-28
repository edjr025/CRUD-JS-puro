'use strict'

//variaveis
const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()   
}

//CRUD - Create
 //funcão para pega o que tem no localstorage(BD) transforme isso em json e armazene na var:getLocalStorage
 const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
 //função para envio de cliente para o localstorage(BD) 
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

const createCliente = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
    
}

//CRUD - Read
const readClient = () => getLocalStorage()

//CRUD - Update
const updateCliente = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
} 

//CRUD - Delete
const deleteCliente = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)
}

//interação com o Layout

const isValidFields = () => {
 return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(fild => {
        fild.value = ''
    });
} 

const saveClient = () => {
    if(isValidFields()){
       const client = {
           nome: document.getElementById('nome').value,
           email: document.getElementById('email').value,
           celular: document.getElementById('celular').value,
           cidade: document.getElementById('cidade').value,
       }
       const index = document.getElementById('nome').dataset.index
       if(index == 'new'){
            createCliente(client)
            clearFields()
            updateTable()
            closeModal()
       }else{
          updateCliente(index, client)
          updateTable()
          closeModal()
       }
      
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id='editar-${index}'>Editar</button>
            <button type="button" class="button red" id='deletar-${index}'>Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) =>{
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    //console.log(client)
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) =>{
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
         //console.log(action, index)
         //action == 'editar' ? console.log('editando o cliente') : console.log('deletando o cliente')
         if(action == 'editar'){
             editClient(index)
         }else{
             const client = readClient()[index]
             const response = confirm(`Deseja excluir o cliente ${client.nome}`)
             if(response){
                 deleteCliente(index)
                 updateTable()
             }
         }

    }
    
}

updateTable()

//eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)