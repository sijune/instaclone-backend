export const processHashtags = (caption) => {
    const hashtags = caption.match(/#[\w]+/g) || []; //null인 경우 대비
    return hashtags.map((hashtag) => ({
        where: { hashtag },
        create: { hashtag },
    }));
};