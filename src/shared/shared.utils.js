import AWS from "aws-sdk";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

export const uploadToS3 = async(file, userId, folderName) => {
    console.log("1111111", file);
    console.log("2222222", userId);
    console.log("3333333", folderName);
    const { filename, createReadStream } = await file;
    console.log("4444444", filename);
    console.log("5555555", createReadStream);
    const newFilename = `${folderName}/${userId}-${Date.now()}-${filename}`;
    console.log("6666666", newFilename);
    const readStream = createReadStream();
    console.log("7777777", readStream);

    console.log("AWS_KEY", process.env.AWS_KEY);
    console.log("AWS_SECRET", process.env.AWS_SECRET);

    const { Location } = await new AWS.S3()
        .upload({
            Bucket: "junstagram-uploads",
            Key: newFilename,
            ACL: "public-read",
            Body: readStream,
        })
        .promise();
    console.log("#####", Location);
    return Location;
};