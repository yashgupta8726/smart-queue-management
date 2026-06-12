import { useState } from "react";
import {
signInWithEmailAndPassword
} from "firebase/auth";

import {
auth
} from "../firebase/firebase";

import {
useNavigate
} from "react-router-dom";

function Login(){

const[email,setEmail]=
useState("");

const[password,
setPassword]=
useState("");

const navigate=
useNavigate();

const handleLogin=
async(e)=>{

e.preventDefault();

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

navigate("/admin");

}

catch{

alert(
"Wrong Email or Password"
);

}

};

return(

<div className="p-10">

<h1 className="text-3xl">

Admin Login

</h1>

<form
onSubmit={handleLogin}
className="flex flex-col gap-5 mt-5"
>

<input
type="email"
placeholder="Email"

onChange={
(e)=>
setEmail(
e.target.value
)
}

/>

<input
type="password"
placeholder="Password"

onChange={
(e)=>
setPassword(
e.target.value
)
}

/>

<button>

Login

</button>

</form>

</div>

);

}

export default Login;