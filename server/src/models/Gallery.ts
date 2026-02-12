import { Schema, model, type Document } from 'mongoose';

export interface IGallery extends Document {
    name: string;
    img: string;
    created_at: Date;
}

const gallerySchema = new Schema<IGallery>(
    {
        name: { type: String, required: true },
        img: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform(_doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export default model<IGallery>('Gallery', gallerySchema);
