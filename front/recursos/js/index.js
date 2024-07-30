async function initData() { // Define una funcion asincronatica
    try { // Inicia un bloque try-catch para manejar errores en operaciones asincronaticas 
        const response = await fetch('/api/v1/init'); // Realiza una solicitud GET
        if (response.ok) { // Verifica si la respuesta es exitosa
            fetchPosts(); // Llama a la funcion fetchPost()
        } else {
            console.error('Error al inicializar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchPosts() { // Define una funcion asincronatica
    try {
        const response = await fetch('/api/v1/posts'); // Realiza una solicitud GET
        const data = await response.json(); // Convierte la respuesta a formato JSON
        const postsList = document.getElementById('lista-posts'); // Obtiene la referencia al elemento HTML con id lista-posts
        postsList.innerHTML = '';  // Limpiar la lista antes de poblarla
        data.posts.forEach(post => { // Itera sobre cada post en data.posts y crea elementos por cada uno
            const listItem = document.createElement('li'); // Crea un nuevo elemento para cada post
            listItem.innerHTML = ` 
                <div>
                    <strong>${post.title}</strong>: ${post.body}
                </div>
                <div>
                    <button onclick="editPost(${post.id})">Editar</button>
                    <button onclick="deletePost(${post.id})">Eliminar</button>
                </div>
            `; // Define el contenido HTML de cada elemento con el titulo y cuerpo del post y botones para editar y eliminar el post
            postsList.appendChild(listItem); // Agrega el elemento al final de la lista-post
        });
    } catch (error) {
        console.error('Error al obtener los posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', initData); // Espera que se cargue completamente el documento HTML y luego llama la funcion initData

document.getElementById('formulario-agregar-post').addEventListener('submit', async (e) => { // Agrega un evento de escucha para el evento de evitar el formulario de agregar post
    e.preventDefault(); // Evita que se realice la accion predeteminada del formulario
    const title = document.getElementById('nuevo-titulo').value; // Obtiene el contenido titulo de nuevo post
    const body = document.getElementById('nuevo-cuerpo').value; // Obtiene el contenido cuerpo de nuevo post

    try {
        const response = await fetch('/api/v1/posts', { //Realiza una solicitud POST 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, body })
        });

        if (response.ok) { // Verifica si la respuesta es exitosa
            fetchPosts();
            document.getElementById('nuevo-titulo').value = ''; // Limpia el campo titulo
            document.getElementById('nuevo-cuerpo').value = ''; // Limpia el campo cuerpo
        }
    } catch (error) {
        console.error('Error al agregar post:', error);
    }
});

async function editPost(id) { // Define una funcion asincrona
    const nuevoTitulo = prompt('Ingrese nuevo título:'); // Pide al usuario ingresar el nuevo titulo 
    const nuevoCuerpo = prompt('Ingrese nuevo cuerpo:'); // Pide al usuario ingresar el nuevo cuerpo
    if (nuevoTitulo && nuevoCuerpo) { // Verifica si se ingresaron el nuevo titulo y nuevo cuerpo
        try {
            const response = await fetch(`/api/v1/posts/${id}`, { // Realiza una solicitud PUT 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: nuevoTitulo, body: nuevoCuerpo })
            });

            if (response.ok) { // Verifica si la respuesta es exitosa
                fetchPosts(); // Llama a fetchPost()
            }
        } catch (error) {
            console.error('Error al editar el post:', error);
        }
    }
}

async function deletePost(id) { // Define una fincion asincronatica
    try {
        const response = await fetch(`/api/v1/posts/${id}`, { // Realiza una solicitud DELETE
            method: 'DELETE'
        });

        if (response.ok) { // Verifica si la respuesta es exitosa 
            fetchPosts(); // Llama a fetchPost()
        }
    } catch (error) {
        console.error('Error al eliminar el post:', error);
    }
}

// Buscar post por ID
document.getElementById('formulario-buscar-post').addEventListener('submit', async (e) => { // Agregar un evento de escucha para el evento buscar post
    e.preventDefault(); // Evita que se realice la accion predeterminada del formulario
    const id = document.getElementById('buscar-id').value; // Obtiene el valor que contiene el id del post buscar

    try {
        const response = await fetch(`/api/v1/posts/${id}`); // Realiza una solicitud GET
        if (response.ok) { // Verifica si la respuesta es exitosa, si es exitosa muesta titulo y cuerpo del post en el elemnto resultado-busqueda
            const post = await response.json();
            const resultadoBusqueda = document.getElementById('resultado-busqueda');
            resultadoBusqueda.innerHTML = `
                <div>
                    <strong>${post.title}</strong>: ${post.body}
                </div>
            `;
        } else {
            console.error('Post no encontrado');
            document.getElementById('resultado-busqueda').innerHTML = 'Post no encontrado';
        }
    } catch (error) {
        console.error('Error al buscar el post:', error);
    }
});
