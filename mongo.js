const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = 
`mongodb+srv://murillobazilio:${password}@cluster0.iqwzpdj.mongodb.net/wizzy?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const campaignSchema = new mongoose.Schema({
  title: String,
  category: String,
  characters: Array
})

const Campaign = mongoose.model('Campaign', campaignSchema);

// const campaign = new Campaign({
//   title: "A new Adventure!",
//   category: "Random Category",
//   characters: [{ name: "Pipo", level: 1, race: "Dog", class: "Daschund" }]
// })

// campaign.save().then(result => {
//   console.log('campaign saved!');
//   mongoose.connection.close();
// })

Campaign.find({}).then(result => {
  result.forEach(campaign => {
    console.log(campaign)
  })
  mongoose.connection.close()
})