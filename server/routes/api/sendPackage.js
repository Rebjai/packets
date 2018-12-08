const router = require("express").Router();
const mongodb = require("mongodb");

router.get("/", async (req, res) => {
  const packets = await loadPackages();
  const arrPackets = await packets.find({}).toArray();
  res.send(arrPackets);
  console.log("get packets");
});
// Add
router.post("/", async (req, res) => {
  const packets = await loadPackages();
  const count = await packets.countDocuments();
  const fileNumber= 100000+count;
  await packets.insertOne({
    sender: {
      name: req.body.sender.name,
      street: req.body.sender.street,
      streetNumber: req.body.sender.streetNumber,
      streetArea: req.body.sender.streetArea,
      postalCode: req.body.sender.postalCode,
      phone: req.body.sender.phone
    },
    destination: {
      name: req.body.destination.name,
      street: req.body.destination.street,
      streetNumber: req.body.destination.streetNumber,
      streetArea: req.body.destination.streetArea,
      postalCode: req.body.destination.postalCode,
      phone: req.body.destination.phone
    },
    data: {
      origin: req.body.data.origin,
      destination: req.body.data.destination,
      weight: req.body.data.weight,
      fileNumber: fileNumber,
      envelope: req.body.data.envelope,
      content: req.body.data.content
    },
    createdAt: new Date(),
    status: 0
  });
  res.status(201).send({count: fileNumber });
});

// put
router.put("/:id", async (req, res) => {
  const packets = await loadPackages();
  await packets.updateOne(
    { _id: new mongodb.ObjectID(req.params.id) },
    {
      $set: {
        status: 1
      }
    }
  );
  res.status(200).send();
  console.log("updated");
});

// Delete
router.delete("/:id", async (req, res) => {
  const packets = await loadPackages();
  await packets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadPackages() {
  const client = await mongodb.MongoClient.connect(
    // "mongodb://127.0.0.1:27017",
    "mongodb://Tester:thisisatest123@ds129484.mlab.com:29484/a-test-db",
    {
      useNewUrlParser: true
    }
  );

  return client.db("packages-db").collection("packages");
}
module.exports = router;
