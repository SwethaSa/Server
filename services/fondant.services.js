import { client } from '../index.js';

export async function deleteFondantCake(id) {
  return await client.db('Aadithya').collection('fondant').deleteOne({ id });
}
export async function updateFondantCakeById(id, image, itemName, price, description) {
  return await client.db('Aadithya').collection('fondant').updateOne({ id }, { $set: { image, itemName, price, description } });
}
export async function createFondantCake(image, itemName, price, description, id) {
  return await client.db('Aadithya').collection('fondant').insertOne({ image, itemName, price, description, id });
}
export async function getFondantCakeById(id) {
  return await client.db('Aadithya').collection('fondant').findOne({ id });
}
export async function getAllFondantCakes() {
  return await client.db('Aadithya').collection('fondant').find({}).toArray();
}
