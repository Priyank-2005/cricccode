import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
AdminSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
