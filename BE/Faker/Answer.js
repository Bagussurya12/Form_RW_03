import { faker } from "@faker-js/faker";
import Answer from "../models/Answer.js";

const run = async (limit) => {
  try {
    let data = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        "6541f949609dc7e748529c92": faker.name.fullName(),
        "6541f9b92b20877b2a02c7c8": faker.helpers.arrayElement(["31", "45"]),
        "6541fa6d7307d1098ab6768b": faker.helpers.arrayElements(["Ayam Bakar", "Nasi Liwet", "Sate Padang"]),
        formId: "6541f924609dc7e748529c90",
        userId: "65379724ace24e828f6f2c2d",
      });
    }
    const fakeData = await Answer.insertMany(data);
    if (fakeData) {
      console.log(fakeData);
      process.exit();
    }
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

export { run };
