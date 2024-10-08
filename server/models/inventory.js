import { generateUniqueIdentifier } from '../utils/utils.js'
import { Schema, model } from 'mongoose'

const inventorySchema = Schema({
    sellerName: { type: String, required: false },
    sellerPhone: { type: String, required: false },
    sellerEmail: { type: String },
    sellerCompamyName: { type: String },
    sellerCity: { type: String, required: false },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    propertyStreetNumber: { type: String, required: false },
    propertyNumber: { type: String, required: false },       // Plot/Shop/Appartment Number
    price: { type: String, required: false },
    remarks: { type: String },
    status: { type: String, default: 'unsold', enum: ['sold', 'unsold', 'underProcess'] },
    isArchived: { type: Boolean, default: false },
    uid: { type: String },
}, { timestamps: true })

// Before saving a new document, generate a unique readable identifier
inventorySchema.pre('save', async function (next) {
    if (!this.uid) {
        let isUnique = false;
        let generatedIdentifier;

        while (!isUnique) {
            // Generate a unique identifier (you can use a library for this)
            generatedIdentifier = generateUniqueIdentifier();

            // Check if it's unique in the collection
            const existingDocument = await this.constructor.findOne({ uid: generatedIdentifier });

            if (!existingDocument) {
                isUnique = true; // Identifier is unique, exit the loop
            }
        }

        // Assign the generated identifier to the document
        this.uid = generatedIdentifier;
    }
    next();
});

const inventoryModel = model('Inventory', inventorySchema)
export default inventoryModel