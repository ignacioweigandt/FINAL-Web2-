import express from 'express'; // Un marco de aplicacion web para node.js
import axios from 'axios'; // Una biblioteca para hacer solicitudes HTTP
import fs from 'fs'; // El modulo del sistema de archivos de Node.js para leer y escribir archivos
import cors from 'cors'; // Un middleware para permitir solicitudes desde diferentes origenes

const app = express(); // Crea una instancia de la aplicacion Express
const PORT = process.env.PORT || 3000; // Define le puerto en el que se ejecute el servidor

app.use(express.json()); // agrega middleware para que express pueda manejar solicitudes con cuerpos en formato JSON
app.use(cors()); // agrega middleware para habilitar CORS, permitiendo que el servidor acepte solicitudes de diferentes origenes

// Endpoint para inicializar la descarga de datos
app.get('/api/v1/init', async (req, res) => { // Define un endpoint GET
    try {
        if (fs.existsSync('./api/posts.json')) { // Comprueba si el archivo ya existe 
            res.status(200).send('Datos ya inicializados.');
            return;
        }

        const response = await axios.get('https://dummyjson.com/posts'); // Hace una peticion HTTP Get al URL usando axios y espera la respuesta
        const data = response.data; // Almacena los datos recibidos en la variable data

        if (!fs.existsSync('./api')) { // Comprueba si la carpeta api existe
            fs.mkdirSync('./api'); // Si no existe lo crea
        }
        fs.writeFileSync('./api/posts.json', JSON.stringify(data, null, 2)); // Escribe los datos recibidos en el archivo formateandolo en JSON
        res.status(200).send('Datos inicializados y guardados.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al inicializar los datos.');
    }
});

// Obtener todos los posts
app.get('/api/v1/posts', (req, res) => { //Define un endpoint GET
    const data = JSON.parse(fs.readFileSync('./api/posts.json')); // Leer un archivo y convierte su contenido de JSON a un objetivo JavaScript
    res.json(data); // Envia los datos leidos en formatos JSON como respuesta al cliente
});

// Obtener un post por ID
app.get('/api/v1/posts/:id', (req, res) => { // Define un endpoint GET 
    const data = JSON.parse(fs.readFileSync('./api/posts.json')); // Lee y parsea el archivo posts.json
    const post = data.posts.find(p => p.id == req.params.id); // busca un post con el id especificado en la solicitud
    if (post) { // Si el post se encuentra, responde con el post en formato JSON
        res.json(post);
    } else {
        res.status(404).send('Post no encontrado.');
    }
});

// Crear un nuevo post
app.post('/api/v1/posts', (req, res) => { // Define un endpoint POST 
    const data = JSON.parse(fs.readFileSync('./api/posts.json')); // Lee y parsea el archivo posts.json
    const nuevoPost = { // Crea un nuevo post con un id unico y los datos del cuerpo de la solicitud
        id: data.posts.length + 1,
        ...req.body
    };
    data.posts.push(nuevoPost); // añade el nuevo post a la lista de post 
    fs.writeFileSync('./api/posts.json', JSON.stringify(data)); // Guarda los datos actualizados en el archivo posts.json
    res.status(201).json(nuevoPost);
});

// Actualizar un post existente
app.put('/api/v1/posts/:id', (req, res) => { // Define un endpoint PUT
    const data = JSON.parse(fs.readFileSync('./api/posts.json')); // Lee y parsea el archivo posts.json
    const index = data.posts.findIndex(p => p.id == req.params.id); // Encuentra el indice del post con el id especificado
    if (index !== -1) { // Si el post se encuentra, crea un nuevo objeto updatedPost con los datos existentes del post y los datos del cuerpo de la solicitud
        const updatedPost = { ...data.posts[index], ...req.body };
        data.posts[index] = updatedPost; // Actualiza el post en la lista de post
        fs.writeFileSync('./api/posts.json', JSON.stringify(data)); // Guarda los datos actualizados en el archivo posts.json
        res.json(updatedPost); // Responde con el post actualizado
    } else {
        res.status(404).send('Post no encontrado.');
    }
});

// Eliminar un post
app.delete('/api/v1/posts/:id', (req, res) => { // Define un endpoint DELETE
    const data = JSON.parse(fs.readFileSync('./api/posts.json')); // Lee y parsea el archivo post.json
    const index = data.posts.findIndex(p => p.id == req.params.id); // Encuentra el indice del post con el id especificado
    if (index !== -1) { // Si el post se encuentra, lo elimina de la lista de post
        data.posts.splice(index, 1);
        fs.writeFileSync('./api/posts.json', JSON.stringify(data)); // Guarda los datos actualizados en el archivo post.json
        res.status(204).send();
    } else {
        res.status(404).send('Post no encontrado.');
    }
});

// Servir el Front-end
app.use(express.static('front')); // Sirve archivos estaticos desde la carpeta front

// Escuchar el puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
