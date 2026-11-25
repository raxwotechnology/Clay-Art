import mongoose from 'mongoose';

const companySettingsSchema = new mongoose.Schema({
    companyName: { type: String, default: 'New Gunasinghe Hardware', trim: true },
    address: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: 'gunasinghehardware@gmail.com', trim: true },
    website: { type: String, trim: true },
    taxRegistrationNumber: { type: String, trim: true },
    receiptFooterMessage: { type: String, default: 'THANK YOU FOR YOUR BUSINESS!\nPLEASE VISIT AGAIN.', trim: true },
    logoUrl: { type: String, default: '' },
    tagline: { type: String, default: 'HARDWARE & WHOLESALE MANAGEMENT', trim: true },
    systemSubtitle: { type: String, default: 'Smart hardware inventory, POS, and financial management.', trim: true }
}, { timestamps: true });

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);
export default CompanySettings;
