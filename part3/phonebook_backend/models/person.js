const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

mongoose.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const numberValidator = (number) => {
  console.log(number[3]);
  return number.length >= 8 && (number[3] === "-" || number[2] === "-");
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: { type: String, validate: numberValidator },
});
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
