import { client } from '../index.js';

export function findMail(email) {
  return client.db("Aadithya").collection("users").findOne({ email });
}
export function insertUser(firstName, lastName, email, hashedPassword, phone) {
  return client.db("Aadithya").collection("users").insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone
  });
}
export function getUserByEmail(email) {
  return client.db('Aadithya').collection('users').findOne({ email: email });
}


export function mailCheck(email) {
  return client.db("Aadithya").collection("users").findOne({ email });
}
