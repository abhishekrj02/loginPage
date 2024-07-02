import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        require: [true, 'UserName is Required'],
        minLength: [5, 'Name must be at least 5 Char'],
        maxLength: [50, 'Max length'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'Email is Required'],
        unique: true,
        lowercase: true,
        unique: [true, ' already registered']
    },
    password: {
        type: String,
        select: false
    },
    forgotPasswordToken: {
        type: String
    },
    forPasswordExpiryDate: {
        type: String
    }

},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})


userSchema.methods = {
    jwtToken(){
        return pkg.sign(
            {id: this.id, email: this.email},
            process.env.SECRET,
            {expiresIn: '24h'}
        )
    }
}

export const userModel = mongoose.model('user',userSchema)

