import { getObjectId } from 'mongo-seeding';
import path from 'path';

export const MAX_DESCRIPTION_LENGTH = 58;
export const ARTICLE_PUBLISH_STATUS = 'publish';
export const POST_TYPES = {
    ATTACHMENT: 'attachment',
    POST: 'post'
};
export const IMG_TAG_REGEX = /<img[^>]*>/g;
export const IMG_SRC_REGEX = /<img.*?src="(.*?)"/;
export const ADMIN_AVATAR = '/server/seeds/data/authors/images/img2.png';
export const DEFAULT_ARTICLE_PREVIEW1 = '/server/seeds/images/default1.jpg';
export const DEFAULT_ARTICLE_WEBP_PREVIEW1 = '/server/seeds/images/default1.webp';
export const DEFAULT_ARTICLE_PREVIEW2 = '/server/seeds/images/default2.jpg';
export const DEFAULT_ARTICLE_WEBP_PREVIEW2 = '/server/seeds//images/default2.webp';
export const DEFAULT_AUTHOR_ID = getObjectId('defaultAdmin');
export const OTHER_CATEGORY_ID = getObjectId('otherCategory');
export const OTHER_SUB_CATEGORY_ID = getObjectId('otherSubCategory');
export const OLD_FILES_FOLDER = 'server/oldFiles';
export const OLD_FILES_FOLDER_PATH = path.resolve(__dirname, `../${OLD_FILES_FOLDER}`);
