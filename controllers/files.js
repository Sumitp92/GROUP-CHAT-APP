const AWS = require('aws-sdk');
const UploadHistory = require('../model/uploadhistory');
const s3 = new AWS.S3();
require('dotenv').config();

// AWS SDK configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const uploadFile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: ' User not authenticated' });
        }
        const userId = req.user.id;
        const file = req.files?.file;

        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/${Date.now()}_${file.name}`,
            Body: file.data,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        const { Location } = await s3.upload(s3Params).promise();
        await UploadHistory.create({
            user_id: userId,
            file_url: Location,
            file_name: file.name,
            upload_date: new Date(),
        });
        res.status(200).json({ fileUrl: Location });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file' });
    }
};

module.exports = { uploadFile };
