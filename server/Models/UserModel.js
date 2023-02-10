import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add an Full Name"]
  },
  email: {
    type: String,
    required: [true, "Please add an Email"],
    unique: true,
    trim: true,
  },
  Password: {
    type: String,
    required: [true, "Please add a Password"],
    minlength: [6, "Password miut be at least '6' characters"],
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  linkedMovies: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
     },
  ],
},
{
    timestamps: true,
}
);

export default mongoose.model("User", UserSchema);