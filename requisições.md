# GET - Todos os registros

```
curl --location --request GET 'https://fullstackdelas-back.onrender.com/linkedin'
```

# GET - Busca por ID

```
curl --location --request GET 'https://fullstackdelas-back.onrender.com/linkedin/-NkwFnvD7A8bmMZvo93H487947'
```

# POST - Cria um registro
```
curl --location --request POST 'https://fullstackdelas-back.onrender.com/linkedin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nome": "Nome do Usuário2", 
    "email": "email2@test.com",
    "linkedin": "https://www.linkedin.com/in/usuario2",
    "frase": "Uma frase bonita2"
}'
```

# PUT - Atualiza um registro
```
curl --location --request PUT 'https://fullstackdelas-back.onrender.com/linkedin/-NkwFnvD7A8bmMZvo93H' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nome": "Nome do Usuário2",
    "email": "email2@test.com",
    "frase": "Uma frase bonita2 Atualizada",
    "linkedin": "https://www.linkedin.com/in/usuario2"
}'
```

# DELETE - Deleta um registro
```
curl --location --request DELETE 'https://fullstackdelas-back.onrender.com/linkedin/-NkwFnvD7A8bmMZvo93Hsd' \
--header 'Content-Type: application/json' \
--data-raw ''
```