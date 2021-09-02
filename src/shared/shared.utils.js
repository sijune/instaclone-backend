import AWS from "aws-sdk";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

export const uploadToS3 = async(file, userId, folderName) => {
    console.log(file);
    const { filename, createReadStream } = await file;
    const newFilename = `${folderName}/${userId}-${Date.now()}-${filename}`;
    const readStream = createReadStream();

    console.log(file);
    const { Location } = await new AWS.S3()
        .upload({
            Bucket: "junstagram-uploads",
            Key: newFilename,
            ACL: "public-read",
            Body: readStream,
        })
        .promise();
    console.log(Location);
    return Location;
};