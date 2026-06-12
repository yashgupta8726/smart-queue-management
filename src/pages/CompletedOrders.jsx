import {
useEffect,
useState
}
from "react";

import {
getOrders
}
from "../services/orderService";

function CompletedOrders(){

const[
orders,
setOrders
]=
useState([]);

useEffect(()=>{

const unsubscribe=
getOrders(
setOrders
);

return ()=>unsubscribe();

},[]);

return(

<div className="p-10">

<h1
className="
text-4xl
font-bold
"
>

Completed Orders

</h1>

{

orders

.filter(
order=>
order.status==="Completed"
)

.length===0

?

<p
className="mt-6"
>

No Completed Orders

</p>

:

orders

.filter(
order=>
order.status==="Completed"
)

.map((order)=>(

<div

key=
{order.id}

className="
border
p-5
mt-5
rounded
"

>

<h2>

Token #

{order.token}

</h2>

<p>

Customer:
{order.customer}

</p>

<p>

Quantity:
{order.quantity}

</p>

<p>

Payment:
{order.payment}

</p>

<p>

Completed

</p>

</div>

))

}

</div>

);

}

export default CompletedOrders;