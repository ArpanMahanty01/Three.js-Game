// import React from "react";
// import { useState } from "react";

// const actionList = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","ShiftLeft"];

// const [action,setAction] = useState();

const keyBoardEventListener = ()=>{
    document.addEventListener("keydown",(event)=>{
    return (event.code);
    console.log(event.code);
    });

    document.addEventListener("keyup",(event)=>{
        console.log('heyya')
    })
}

export default keyBoardEventListener;
