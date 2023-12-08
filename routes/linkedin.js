const express = require("express");
const router = express.Router();
const firebaseAdmin = require("firebase-admin");

// Obter uma referência ao banco de dados
const db = firebaseAdmin.database();

// Endpoint para criar um novo registro (OK)
router.post("/", async (req, res) => {
 
  /*
  #swagger.path = '/linkedin'
  #swagger.method = 'post'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para cadastrar um registro.'
  #swagger.request['body'] = {description: 'blablabla', $ref: "#/definitions/requestRegisterCreate"}
  */
  const { nome, email, linkedin, frase } = req.body;
  const ref = await db.ref("linkedin").push({ "nome": nome, "email": email, "linkedin": linkedin, "frase": frase }, function(error) {
    if (error) {
      console.log("Failed with error: " + error)
      /* #swagger.responses[500] = {
        description: 'Erro interno do servidor',
        schema: {$ref: "#/definitions/responseError"} }
      } */
      res.status(500).json({ "error": "Erro interno do servidor" });
    }
  })

  /* #swagger.responses[201] = {
    description: 'Registro cadastrado com sucesso',
    schema: {$ref: "#/definitions/responseCreateSuccess"} }
  } */
  res.status(201).json({ "msg": "Registro cadastrado com sucesso", "key": ref.key });
});
  
// Endpoint para obter todos os registros (OK)
router.get("/", async (req, res) => {
  /*
  #swagger.path = '/linkedin'
  #swagger.method = 'get'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para retornar todos registro.'
  */
  db.ref("linkedin").once("value", (snapshot) => {
    // O objeto 'snapshot' contém os dados do nó 'linkedin'
    const linkedinData = snapshot.val();

    const linkedinArray = Object.keys(linkedinData).map((key) => {
      return {
        id: key,
        ...linkedinData[key]
      };
    });
  
    /* #swagger.responses[201] = {
      description: 'Todos os registros retornados',
      schema: {$ref: "#/definitions/responseGet"} }
    } */
    res.status(201).json(linkedinArray);
  })
  .catch((error) => {
    /* #swagger.responses[500] = {
      description: 'Erro interno do servidor',
      schema: {$ref: "#/definitions/responseError"} }
    } */
    console.error("Erro ao obter dados do Firebase:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  });
});
  
  // Endpoint para obter um registro por ID (OK)
router.get("/:id", async (req, res) => {
  /*
  #swagger.path = '/linkedin/{id}'
  #swagger.method = 'get'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para obter um registro por ID.'
  */
  try {
    const { id } = req.params;
    db.ref("linkedin").child(id).once("value", (snapshot) => {
      const objetoData = snapshot.val();
      if (objetoData) {
        /* #swagger.responses[201] = {
          description: 'Registro retornado pelo ID',
          schema: {$ref: "#/definitions/responseGetRegisterById"} }
        } */
        res.status(201).json(objetoData);
      } else {
        /* #swagger.responses[404] = {
          description: 'Registro não encontrado',
          schema: {$ref: "#/definitions/responseNotFound"} }
        } */
        res.status(404).json({ error: "Registro não encontrado"});
      }
    })
    .catch((error) => {
      /* #swagger.responses[500] = {
        description: 'Erro interno do servidor',
        schema: {$ref: "#/definitions/responseError"} }
      } */
      console.error("Erro ao obter dados do Firebase:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  } catch (error) {
    /* #swagger.responses[500] = {
      description: 'Erro interno do servidor',
      schema: {$ref: "#/definitions/responseError"} }
    } */
    console.error("Erro ao obter registro por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
  
// Endpoint para atualizar um registro por ID (OK)
router.put("/:id", async (req, res) => {
  /*
  #swagger.path = '/linkedin/{id}'
  #swagger.method = 'put'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para atualizar um registro por ID.'
  */
  const { id } = req.params;
  const { nome, email, linkedin, frase } = req.body;
  let objetoData = undefined

  await db.ref("linkedin").child(id).once("value", (snapshot) => {
    objetoData = snapshot.val();
      if (!objetoData) {
        res.status(404).json({ error: "Registro não encontrado"});
      }
  });

  if (objetoData) {
    await db.ref("linkedin").child(id).update({ 
      "nome": nome,
      "email": email,
      "linkedin": linkedin,
      "frase": frase
    }).then(() => {
      /* #swagger.responses[201] = {
        description: 'Registro atualizado com sucesso',
        schema: {$ref: "#/definitions/responseUpdateSuccess"} }
      } */
      res.status(201).json({ "msg": "Registro atualizado com sucesso", "key": id });
      console.log("Registro atualizado com sucesso!");
    })
    .catch((error) => {
      /* #swagger.responses[500] = {
        description: 'Erro interno do servidor',
        schema: {$ref: "#/definitions/responseError"} }
      } */
      console.error("Erro ao atualizar registro no Firebase:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  }
});
  
// Endpoint para excluir um registro por ID (OK)
router.delete("/:id", async (req, res) => {
  /*
  #swagger.path = '/linkedin/{id}'
  #swagger.method = 'delete'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para excluir um registro por ID.'
  */
  try {
    const { id } = req.params;
    await db.ref("linkedin").child(id).remove();
    /* #swagger.responses[201] = {
      description: 'Registro excluído com sucesso',
      schema: {$ref: "#/definitions/responseDeleteSuccess"} }
    } */
    res.status(201).json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    /* #swagger.responses[500] = {
      description: 'Erro interno do servidor',
      schema: {$ref: "#/definitions/responseError"} }
    } */
    console.error("Erro ao excluir registro por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
