# Bartify

Aplicacion de venta y trueque de artículos de segunda mano para Integradora 2

## Desarrolladores

Ofeck Megidish Ascencio\
Jose Canche Palacio\
Hector Lopez Cano\
Rashmy Amarilis Cortes Martinez

## Instalación
1. Utiliza el comando `git clone https://github.com/Ofeckss/BF.git` en una carpeta para descargar el proyecto.
2. Entrar a la carpeta BF.
3. Escribir el siguiente comando en la terminal: `npm install`.
4. Utilizar el comando `git pull origin main` para descargar los cambios antes de comenzar a programar.

## Subir Cambios
1. Usa el comando `git status` para comprobar los cambios.
2. Usa el comando `git add .` para agregar los cambios.
3. Usa el comando `git commit -m "DESCRIPCIÓN"` para hacer un commit y una descripción de las adiciones o cambios.
4. Usa el comando `git push origin main` para subir los cambios al repositorio.
### NOTA
La primera vez que se quiera subir un cambio al repositorio debe usarse el comando
`git push -u origin main`

## Instalación de instancias Frontend
1. Para instalación de Pinia usa el comando `npm install pinia vue-router@4` (esta instancia creará las rutas entre las páginas)
## Backend setup

En el folder back (cd back), ejecuten:

```bash
dotnet user-secrets init
[EL COMANDO QUE YO LES PASÉ]
dotnet run
```

## APIS

API_URL = http://localhost:5246

# Usuarios

**Registro**

POST: API_URL/api/register
```
Params:
{
  "nombre": "string",
  "email": "string",
  "password": "string"
}
```
**Login**

POST: API_URL/api/login (Regresa un token(string))
```
Params:
{
  "email": "string",
  "password": "string"
}
```
**Get usuario por id**

GET: API_URL/api/{id}


# Categorias

**Categorías principales**

GET: API_URL/api/categorias

**Buscar subcategorías por categoría principal**

GET: API_URL/api/categorias/{id}

Estos regresan un array de objetos `{id: 0, nombre: 0, padre_id: 0}`


# Estados (Nuevo, semi nuevo, etc)

**GetAll**

GET: API_URL/api/estados


# Ubicaciones (Nombres de ciudades)

**GetAll**

GET: API_URL/api/ubicaciones

Estos 2 /\ regresan un array de objetos `{id: 0, nombre: 0}`


# Articulos

**Crear artículo (Regresa el id del articulo, se tiene que usar para mandar las fotos separadamente)**

POST API_URL/api/articulos
```
Params:
{
  "nombre": "string",
  "descripcion": "string",
  "precio": 0.1,
  "categoriaId": 0,
  "esTrueque": true,
  "estadoId": 0,
  "ubicacionId": 0
}
```
**GetAll (Regresa todos los articulos con su foto principal)**

GET API_URL/api/articulos

**GetByUsuario (Todos los articulos con su foto principal de un usuario)**

GET API_URL/api/articulos/usuario/{id}
```
{
Respuesta de GetByUsuario y GetAll
    "id": "019ef831-a042-7f7a-9b7d-5e49399efefb",
    "nombre": "1234",
    "descripcion": "1234",
    "precio": 1234,
    "esTrueque": false,
    "disponible": true,
    "url": null,
    "ubicacion": {
      "id": 2,
      "nombre": "Cancun"
    },
    "createdAt": "2026-06-24T00:54:22",
    "categoria": {
      "id": 1,
      "nombre": "Electrónicos"
    },
    "vendedor": {
      "vendedorId": "019ef7d2-a449-7b17-9226-16204d157d4f",
      "nombre": "Ofeck",
      "apellido": null
    }
```
**GetById (Regresa el articulo sin fotos, hay que fetch las fotos por separado)**

GET API_URL/api/articulos/{id}


# Fotos

**Subir una foto**

POST API_URL/api/fotos
```
{
"files": array<string>
"articuloId": string($uuid)
}
```
**Conseguir un array de ulrs de Cloudinary**

GET API_URL/api/fotos/{articuloId} 

## **TODAS LAS IDS (Expecto las de categorias, ubicaciones y estados) SON UIDS, SIEMPRE USEN STRINGS CON UNA UID**

