import mongoose from 'mongoose';
const { Schema } = mongoose;
const contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
},
  email:{
    type: String,
    required: true
},
  phone: {
    type: Number,
    required: true
},
});
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;