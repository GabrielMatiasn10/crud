const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const btnSalvar = document.querySelector('#btnSalvar');
const handleModalClick = document.querySelector('handleModalClick')

let itens = [];
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.closest('.modal-container')) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    const { nome, funcao, salario } = itens[index];
    sNome.value = nome;
    sFuncao.value = funcao;
    sSalario.value = salario;
    id = index;
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  const tr = document.createElement('tr');
  const { nome, funcao, salario } = item;

  tr.innerHTML = `
    <td>${nome}</td>
    <td>${funcao}</td>
    <td>R$ ${salario}</td>
    <td class="acao">
      <button data-index="${index}" data-action="edit"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button data-index="${index}" data-action="delete"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function saveItem() {
  if (sNome.value === '' || sFuncao.value === '' || sSalario.value === '') {
    return;
  }

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].funcao = sFuncao.value;
    itens[id].salario = sSalario.value;
  } else {
    itens.push({ nome: sNome.value, funcao: sFuncao.value, salario: sSalario.value });
  }

  setItensBD();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
}

function handleTableClick(e) {
  const button = e.target.closest('button');
  if (button && button.dataset.action === 'edit') {
    const index = button.dataset.index;
    editItem(index);
  } else if (button && button.dataset.action === 'delete') {
    const index = button.dataset.index;
    deleteItem(index);
  }
}

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

function getItensBD() {
  return JSON.parse(localStorage.getItem('dbfunc')) || [];
}

function setItensBD() {
  localStorage.setItem('dbfunc', JSON.stringify(itens));
}

loadItens();
modal.addEventListener('click', handleModalClick);
btnSalvar.addEventListener('click', saveItem);
tbody.addEventListener('click', handleTableClick);
