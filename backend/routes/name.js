

const express = require("express");
const router = express.Router();




router.post("/", async (req, res) => {
    const {name} = req.body

    const io = req.io;

    // const rooms = io.sockets.adapter.rooms;

    // for(const [roomId,members] of rooms){
    //     console.log("roomId:",roomId);
    //     console.log("Members:",members);
    //     console.log("")
    // }

    
    // console.log(name);
    req.io.to("displays").emit("newName", {name});


    console.log("sending to all displays");

    res.json({ success: true, name: name});

})





module.exports = router;



