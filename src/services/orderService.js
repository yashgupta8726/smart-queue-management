import {
collection,
addDoc,
getDocs,
onSnapshot
}
from "firebase/firestore";

import {
db
}
from "../firebase/firebase";



// CREATE ORDER

export const createOrder =
async (order) => {

const snapshot =
await getDocs(
collection(
db,
"orders"
)
);

const token =
snapshot.size + 1;

await addDoc(

collection(
db,
"orders"
),

{

...order,

token

}

);

return token;

};



// GET LIVE ORDERS

export const getOrders =
(callback) => {

return onSnapshot(

collection(
db,
"orders"
),

(snapshot) => {

const orders =

snapshot.docs.map(
(doc) => ({

id:
doc.id,

...doc.data()

})
);

callback(
orders
);

}

);

};

import {
doc,
updateDoc
}
from "firebase/firestore";



export const updateOrderStatus =
async(id,status)=>{

await updateDoc(

doc(
db,
"orders",
id
),

{

status

}

);

};