import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
getOrders,
updateOrderStatus
}
from "../services/orderService";

function Dashboard(){

const navigate=
useNavigate();

const [orders,setOrders]=
useState([]);

const [autoPrint,setAutoPrint]=
useState(false);

useEffect(()=>{

const unsubscribe=
getOrders((data)=>{

setOrders(data);

});

return ()=>unsubscribe();

},[]);

const revenue=

orders.reduce(

(sum,order)=>

sum+
(order.totalPrice||0),

0

);

const completed=

orders.filter(

o=>

o.status==="Completed"

).length;

const pending=

orders.filter(

o=>

o.status!=="Completed"

).length;

return(

<div className="p-8">

<h1
className="
text-4xl
font-bold
"
>

Smart Queue Dashboard

</h1>



<div
className="
grid
grid-cols-3
gap-4
mt-8
"
>

<div
className="
border
rounded
p-5
"
>

<h2>

Revenue

</h2>

<p>

₹{revenue}

</p>

</div>

<div
className="
border
rounded
p-5
"
>

<h2>

Completed

</h2>

<p>

{completed}

</p>

</div>

<div
className="
border
rounded
p-5
"
>

<h2>

Pending

</h2>

<p>

{pending}

</p>

</div>

</div>



<div
className="
flex
items-center
gap-3
mt-8
"
>

<p>

Auto Print

</p>

<input

type="checkbox"

checked={
autoPrint
}

onChange={
(e)=>
setAutoPrint(
e.target.checked
)
}

/>

</div>



<div
className="
flex
gap-4
mt-8
"
>

<button

className="
border
rounded
p-3
"

onClick={()=>

navigate(
"/analytics"
)

}

>

Analytics

</button>



<button

className="
border
rounded
p-3
"

onClick={()=>

navigate(
"/completed"
)

}

>

View Completed

</button>



<button

className="
border
rounded
p-3
"

onClick={()=>

navigate(
"/take-order",
{
state:{
autoPrint
}
}
)

}

>

Take New Order

</button>

</div>



<div
className="
mt-10
"
>

<h2
className="
text-2xl
font-bold
"
>

Live Queue

</h2>

{

orders

.filter(
order=>
order.status!=="Completed"
)

.sort(
(a,b)=>
a.token-b.token
)

.length===0

?

<p
className="
mt-5
"
>

No Orders Yet

</p>

:

orders

.filter(
order=>
order.status!=="Completed"
)

.sort(
(a,b)=>
a.token-b.token
)

.map((order)=>(

<div

key={
order.id
}

className="
border
rounded
p-5
mt-5
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

Payment:
{order.payment}

</p>

<p>

Jalebi:
{order.jalebi}kg

</p>

<p>

Dahi:
{order.dahi}kg

</p>

<p>

Total:
₹
{order.totalPrice}

</p>

<p>

Status:
{order.status}

</p>

<div
className="
flex
gap-3
mt-4
"
>

<button

onClick={()=>

updateOrderStatus(
order.id,
"Preparing"
)

}

>

Preparing

</button>

<button

onClick={()=>

updateOrderStatus(
order.id,
"Be Ready"
)

}

>

Be Ready

</button>

<button

onClick={()=>

updateOrderStatus(
order.id,
"Take From Counter"
)

}

>

Counter

</button>

<button

onClick={()=>

updateOrderStatus(
order.id,
"Completed"
)

}

>

Completed

</button>

</div>

</div>

))

}

</div>

</div>

);

}

export default Dashboard;