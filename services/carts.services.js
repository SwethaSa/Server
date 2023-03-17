import { client } from '../index.js';

export async function getAllCart(userEmail) {
  return await client.db('Aadithya').collection('cart').find({ userEmail: userEmail }).toArray();
}
export async function updateCart(userEmail, id, quantity) {
  return await client
    .db('Aadithya')
    .collection('cart')
    .updateOne({ userEmail, id }, { $set: { quantity } });
}
export async function clearCart(userEmail) {
  return await client.db('Aadithya').collection('cart').deleteMany({ userEmail });
}
export async function findCakeOne(id) {
  const collections = ['cakes', 'icecakes', 'fondant'];
  for (let collectionName of collections) {
    const collection = client.db('Aadithya').collection(collectionName);
    const cake = await collection.findOne({ id });
    if (cake) {
      return cake;
    }
  }
  // If no match found in any collection, return null
  return null;
}

export async function deleteCake(id) {
  return await client.db('Aadithya').collection('cart').deleteOne({ id });
}
export async function updateCartVar(id, updatedPrice, updatedQuantity, updatedImage, updatedName, userEmail) {
  return await client.db('Aadithya').collection('cart').updateOne(
    { id },
    { $set: { price: updatedPrice, quantity: updatedQuantity, image: updatedImage, name: updatedName, userEmail: userEmail } },
    { upsert: true }
  );
}
export async function findCart(id) {
  return await client.db('Aadithya').collection('cart').findOne({ id });
}
export async function findCake(id) {
  const collections = ['cakes', 'icecakes', 'fondant'];
  for (let collectionName of collections) {
    const collection = client.db('Aadithya').collection(collectionName);
    const cake = await collection.findOne({ id });
    if (cake) {
      return cake;
    }
  }
  // If no match found in any collection, return null
  return null;
}

