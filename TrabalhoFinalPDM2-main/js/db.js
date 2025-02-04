import { openDB } from 'idb';

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('fotos', { 
                            keyPath: 'id', 
                            autoIncrement: true });
                        console.log("Banco de dados criado!");
                }
            }
        });
        console.log("Banco de dados aberto.");
    } catch (e) {
        console.error("Erro ao criar o banco de dados: " + e.message);
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    await createDB();
    document.getElementById("btnListar").addEventListener("click", getData); 
    document.getElementById("btnAtualizar").addEventListener("click", getData);
});

async function getData() { 
    if (!db) {
        console.error("O banco de dados está fechado");
        return;
    }

    console.log('Buscando imagens no banco de dados...');
    const tx = db.transaction('fotos', 'readonly');
    const store = tx.objectStore('fotos');
    const value = await store.getAll();
    if (value.length > 0) {
        const listagem = value.map(imageData => {
            return `<div class="foto-polaroid">
                <img src="${imageData.src}" alt="Foto" />
                <button onclick="apagaFoto(${imageData.id})">Remover</button> 
            </div>`;
        });
        showResult(listagem.join(''));
    } else {
        showResult("Não há nenhuma foto no banco!");
    }
}

function showResult(text) {
    document.getElementById('resultados').innerHTML = text;
}

window.apagaFoto = async function apagaFoto(id) {
    if (!db) {
        console.error("O banco de dados não está aberto.");
        return;
    }

    console.log(`Removendo imagem com ID ${id}...`);
    const tx = db.transaction('fotos', 'readwrite');
    const store = tx.objectStore('fotos');
    await store.delete(id);
    await tx.done;
    console.log('Foto removida com sucesso!');
    getData(); 
}

export async function salvaFoto(imageData) {
    if (!db) {
        console.error('Banco de dados não está aberto.');
        return;
    }

    console.log('Salvando imagem no banco de dados...');
    const tx = db.transaction('fotos', 'readwrite');
    const store = tx.objectStore('fotos');
    await store.add({ src: imageData });
    await tx.done;
    console.log('Foto salva com sucesso!');
}
