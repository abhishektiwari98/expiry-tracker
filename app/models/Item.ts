import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
    name: string;
    expiryDate: string;
    barcode?: string;
    icon: string;
}

const ItemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    expiryDate: { type: String, required: true },
    barcode: { type: String },
    icon: { type: String, required: true }, // ✅ Ensure icon is required
});

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
