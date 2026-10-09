// // const express = require("express");
// // const cookieParser = require("cookie-parser");

// // const app = express();

// // // Middleware
// // app.use(cookieParser());
// // app.use(express.json());

// // // Home route
// // app.get("/", (req, res) => {
// //     res.send("Hello Cookie");
// // });

// // // Set cookie
// // app.get("/setcookie", (req, res) => {
// //     res.cookie("username", "vishuu patel", {
// //         maxAge: 1000 * 60 * 5, // 5 minutes
// //         httpOnly: true,
// //         sameSite: "strict"
// //     });

// //     res.send("Cookie has been set");
// // });

// // // Get cookie
// // app.get("/getcookie", (req, res) => {
// //     const username = req.cookies.username;

// //     if (username) {
// //         res.send(`Username from cookies: ${username}`);
// //     } else {
// //         res.send("Cookie not found");
// //     }
// // });

// // // Clear cookie
// // app.get("/clearcookie", (req, res) => {
// //     res.clearCookie("username", {
// //         httpOnly: true,
// //         sameSite: "strict"
// //     });

// //     res.send("Cookie has been cleared");
// // });

// // // Start server
// // app.listen(3000, () => {
// //     console.log("Server running at http://localhost:3000");
// // });


// const express = require("express");
// const cookieParser = require("cookie-parser");

// const app = express();

// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello Node.js");
// });

// app.get("/set-cookie", (req, res) => {
//   res.cookie("username", "rahul");

//   res.send("Cookie create ho gayi");
// });

// app.get("/get-cookie", (req, res) => {
//   const username = req.cookies.username;

//   res.send(`Username hai: ${username}`);
// });

// app.get("/delete-cookie", (req, res) => {
//   res.clearCookie("username");

//   res.send("Cookie delete ho gayi");
// });

// app.listen(3000, () => {
//   console.log("Server running on port  http://localhost:3000");
// });



const express = require('express');
// const { use } = require('react');

const app = express();

app.use(express.json());

let users = [
  {
    name:"jhon",
    email:"jhon@gmail.com",
    age:"18"
  }
];

app.post("/users", (req, res) => {


  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({
      messge: "name,eamil and age are required",
    });
  }

  const user = {
    id: users.length + 1,
    name: name,
    email: email,
    age: age
  }

  users.push(user);

  res.status(200).json({
    message: "user create successfully",
    user: user
  });
});

//UPDATE USER

app.put("/user/:id", (req, res) => {

  const id = parseInt(req.params.id);

  const { name, email, age } = req.body;

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  user.name = name;
  user.email = email;
  user.age = age;

  res.json({
    message: "user are successfully updated",
    user: user
  });
});

//DELETE USER

app.delete("/user/:id", (req, res) => {

  const id = parseInt(req.params.id);

  const findIndex = users.findIndex(user => user.id === id);

  if (findIndex === -1) {
    return res.status(404).json({
      message: "user are not found",
    });
  }

  users.splice(findIndex, 1);

  res.json({
    message: "user delete successfully",
  });

});

app.get("/users", (req, res) => {

  res.json({
    message: "All users fetched successfully",
    users: users
  });

});

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000")
});


//CREATE USER 

exports.creatuser = async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    res.status(200).json({
      message: "user created successfully",
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false, // fronted ne kbr pade api faild gai 
      message: err.message
    });
  }
};

// CREATE USER WITH HASH PASSWORD

exports.creatuser = async (req, res) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashpassword
    });

    await user.save();

    res.status(200).json({
      message: "user created successfully",
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false, // fronted ne kbr pade api faild gai 
      message: err.message
    });
  }
};

// SEARCH USER 

exports.search = async (req, res) => {
  try {
    const value = req.params.value;

    const user = User.findOne({
      $or: [
        { name: value },
        { email: value },
        { password: value },
      ]
    });

    if (!user) {
      res.status(404).json({
        message: "user not found"
      });
    }

    res.status(200).json({
      message: "user are successfully fetched",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE USER

exports.delete = async (req, res) => {
  try {
    const user = await user.findbyIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    res.status(200).json({
      message: "user delete sucessfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

//UPDATE USER

exports.updateuser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    delete updateData.refreshToken;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user update successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//UPDATE ALL USER

exports.updateAll = async (req,res) =>{
  try{
    const user = await user.updateMany(
      {},
      {
      graduation:req.body.graduation,
      address:req.body.address
      }
    );
    res.status(200).json({
      message:"all user updated successfully",
       modifiedCount: result.modifiedCount
    });
  }catch(err){
    res.status(500).json({
      message:err.message
    });
  }
};

// REFRESH TOKEN

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "refreshToken is required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken
        });

    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
};