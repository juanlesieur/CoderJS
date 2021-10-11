//defino constantes donde se toman los ID pertenecientes en el HTML
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
  fetchData()
  if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  }
})
//Detectamos el boton de compra
cards.addEventListener('click', e => {
  addCarrito(e)
})

items.addEventListener('click', e =>{
  btnAccion(e)
})

const fetchData = async () =>{
  try{
    const res = await fetch('api.json')
    const data = await res.json()
    //console.log(error)
    pintarCards(data)
  } catch (error) {
    console.log(error)
  }
}

//Definimos la función para pintar el objeto
const pintarCards = data =>{
  data.forEach(producto =>{
    templateCard.querySelector('h5').textContent = producto.titulo
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute("src", producto.imagen)
    templateCard.querySelector('.btn-dark').dataset.id = producto.id
    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)
}

const addCarrito = e => {
  //console.log(e.target)
  //console.log(e.target.classList.contains('btn-dark'))

  if(e.target.classList.contains('.btn-dark')){
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

//Captura los elementos enviados al carrito
const setCarrito = objeto => {
  const producto ={
    id: objeto.querySelector('.btn-dark').dataset.id,
    titulo: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1,
  }
  //Detecta si el producto es seleccionado más de una vez, y aumenta su cantidad. 
  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
  }

  carrito[producto.id] = {...producto}

}

//pintamos los objetos elegidos en el carrito de compra

const pintarCarrito = () =>{
  items.innerHTML = ''
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = prodcuto.cantidad * producto.precio
    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
  //Modificamos el footer cuando se agregan productos al carrito

  pintarFooter()

  localStorage.setItem('carrito', JSON.stringify(carrito))

}

//Definimos la funcion que modifica el footer

const pintarFooter = () =>{
  footer.innerHTML = ''
  //Condicion que detecta si hay o no objetos en el carrito
  if(Object.keys(carrito).length === 0){
    footer.innerHTML=`
    <th scope="row" colspan="5">Carrito vació :( comience a comprar!</th>
    `
    return
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad , 0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })
}

//Accion de aumentar o disminuir elementos del carrito
const btnAccion = e => {
  if(e.target.classList.contains('btn-info')){
    //carrito[e.target.dataset.id]

    const producto = carrito[e.target.dataset.id]
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito()
  }
  if(e.target.classList.contains('btn-danger')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
    if (producto.cantidad === 0 ){
      delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
  }

  e.stopPropagation()
}