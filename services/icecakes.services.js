import { client } from '../index.js';

export async function deleteiceCake(id) {
  return await client.db('Aadithya').collection('icecakes').deleteOne({ id });
}
export async function updateiceCakeById(id, image, itemName, price, description) {
  return await client.db('Aadithya').collection('icecakes').updateOne({ id }, { $set: { image, itemName, price, description } });
}
export async function createiceCake(image, itemName, price, description, id) {
  return await client.db('Aadithya').collection('icecakes').insertOne({ image, itemName, price, description, id });
}
export async function geticeCakeById(id) {
  return await client.db('Aadithya').collection('icecakes').findOne({ id });
}
export async function getAlliceCakes() {
  return await client.db('Aadithya').collection('icecakes').find({}).toArray();
}
