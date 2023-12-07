const express = require("express");
const router = express.Router();
const firebaseAdmin = require("firebase-admin");

// Obter uma referência ao banco de dados
const db = firebaseAdmin.database();

// Endpoint para criar um novo registro (OK)
router.post("/", async (req, res) => {
  // #swagger.start
 
  /*
  #swagger.path = '/linkedin'
  #swagger.method = 'post'
  #swagger.tags = ['Linkedin']
  #swagger.description = 'Endpoint para cadastrar um registro.'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Informações',
    required: true,
    schema: {$ref: "#/definitions/requestBody"}
  }*/
  const { nome, email, linkedin, frase } = req.body;
  const ref = await db.ref("linkedin").push({ "nome": nome, "email": email, "linkedin": linkedin, "frase": frase }, function(error) {
    if (error) {
      console.log("Failed with error: " + error)
      // #swagger.response[500] = {error: 'Erro interno do servidor'}
      res.status(500).json({ "error": "Erro interno do servidor" });
    }
  })

  // #swagger.response[201] = {msg: 'Registro cadastrado com sucesso', key: -NkwFnvD7A8bmMZvo93H}
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
  
    res.status(201).json(linkedinArray);
  })
  .catch((error) => {
    console.error("Erro ao obter dados do Firebase:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  });
});
  
  // Endpoint para obter um registro por ID (OK)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    db.ref("linkedin").child(id).once("value", (snapshot) => {
      const objetoData = snapshot.val();
      if (objetoData) {
        res.status(201).json(objetoData);
      } else {
        res.status(404).json({ error: "Registro não encontrado"});
      }
    })
    .catch((error) => {
      console.error("Erro ao obter dados do Firebase:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  } catch (error) {
    console.error("Erro ao obter registro por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
  
// Endpoint para atualizar um registro por ID (OK)
router.put("/:id", async (req, res) => {
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
      res.status(201).json({ "msg": "Registro atualizado com sucesso", "key": id });
      console.log("Registro atualizado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao atualizar registro no Firebase:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  }
});
  
// Endpoint para excluir um registro por ID (OK)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.ref("linkedin").child(id).remove();
    res.status(201).json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir registro por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
