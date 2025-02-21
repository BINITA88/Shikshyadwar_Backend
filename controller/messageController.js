// const mongoose = require('mongoose');
// const Conversation = require("../models/conversationModel.js");
// const Message = require("../models/messageModel.js");
// const { getReceiverSocketId, io } = require("../socket/socket.js");

// exports.sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }

//     await Promise.all([conversation.save(), newMessage.save()]);

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// // exports.getMessage = async (req, res) => {
// //   try {
// //       const conversation = await Conversation.findById(req.params.id)
// //           .populate("messages")  // ✅ Fetch actual messages instead of ObjectId
// //           .populate("participants");  // ✅ Fetch participant user details

// //       if (!conversation) {
// //           return res.status(404).json({ error: "Conversation not found" });
// //       }

// //       res.status(200).json(conversation);
// //   } catch (error) {
// //       console.error("❌ Backend Error:", error);
// //       res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };

// exports.getMessage = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const senderId = req.user._id;

//     // Ensure userToChatId is cast to ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     console.log("here",senderId,userToChatId);
    

//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId,userToChatId] }
//     }).populate("messages");
//     console.log(conversation)

//     if (!conversation) return res.status(200).json([]);

//     const message = conversation.messages;

//     res.status(200).json(message);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



const mongoose = require('mongoose');
const Conversation = require("../models/conversationModel.js");
const Message = require("../models/messageModel.js");
// const { getReceiverSocketId, io } = require("../socket/socket.js");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate message content and sender ID
    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }
    if (!senderId) {
      return res.status(400).json({ error: "Sender ID is missing" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If conversation doesn't exist, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // Push message to conversation
    conversation.messages.push(newMessage._id);

    // Save conversation and new message
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit to receiver socket if connected
    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Validate userToChatId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find the conversation between participants
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]); // Return empty array if no conversation

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
