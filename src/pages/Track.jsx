import {
useEffect,
useState
}
from "react";


import {
getOrders
}
from "../services/orderService";



function Track(){


const [orders,setOrders]=
useState([]);




useEffect(()=>{


const unsubscribe =

getOrders(
(data)=>{

setOrders(data);

}

);


return ()=>unsubscribe();


},[]);





const queue =

orders

.filter(
(order)=>
order.status !== "Completed"
)

.sort(
(a,b)=>
a.token-b.token
);





const current =
queue[0];


const next =
queue[1];





return(


<div

className="
min-h-screen
bg-orange-50
p-6
"

>


<h1

className="
text-4xl
font-bold
text-center
"

>

Smart Queue Tracking

</h1>





{/* CURRENT ORDER */}

<div

className="
bg-white
rounded-xl
shadow
p-6
mt-8
"

>


<h2

className="
text-xl
font-bold
"

>

Now Preparing

</h2>



{

current ?


<>

<h1

className="
text-6xl
font-bold
text-orange-600
mt-4
"

>

#{current.token}

</h1>



<p className="mt-3">

Customer:
{current.customer}

</p>



<p>

Status:
{current.status}

</p>


</>


:


<p className="mt-3">

No Active Orders

</p>


}



</div>






{/* NEXT ORDER */}


{

next &&

<div

className="
bg-yellow-100
rounded-xl
p-6
mt-5
"

>


<h2

className="
text-xl
font-bold
"

>

Be Ready

</h2>



<h1

className="
text-5xl
font-bold
mt-3
"

>

#{next.token}

</h1>



<p>

Customer:
{next.customer}

</p>


</div>


}





{/* ALL ORDERS */}



<div

className="
bg-white
rounded-xl
shadow
p-6
mt-5
"

>


<h2

className="
text-2xl
font-bold
"

>

All Orders

</h2>




{


queue.length===0


?


<p className="mt-4">

No Orders

</p>



:


queue.map(
(order)=>(


<div

key={order.id}

className="
border
rounded-lg
p-4
mt-4
"

>


<h3

className="
text-xl
font-bold
"

>

Token #{order.token}

</h3>



<p>

Customer:
{order.customer}

</p>



<p>

Items:

Jalebi {order.jalebi}kg

,

Dahi {order.dahi}kg

</p>



<p>

Payment:
{order.payment}

</p>



<p>

Status:
{order.status}

</p>



</div>


)

)



}



</div>





<p

className="
text-center
mt-8
text-gray-500
"

>

Please wait for your token number

</p>



</div>


);


}



export default Track;