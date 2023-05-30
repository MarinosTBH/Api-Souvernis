import mongoose from "mongoose";

const userSchema = mongoose.Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true} ,
    password: {type: String, required: true} ,
    id: {type: String} ,
    role : {type: String, enum : ["admin", "user"], default: "user", required : true},
    active : {type : Boolean, default : true, required : true},
    picture: {type : String, required : true}
})

export default mongoose.model('User', userSchema);