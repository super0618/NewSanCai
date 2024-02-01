import mysql from 'mysql2';
import mongoose from 'mongoose';
import striptags from 'striptags';
import request from 'superagent';
import fs from 'fs';
import path from 'path';
import uniqId from 'uniqid';
import { getObjectId } from 'mongo-seeding';
import pLimit from 'p-limit';
import cliProgress from 'cli-progress';
import webpConverter from 'webp-converter';
import sharp from 'sharp';

import { categories, subCategoriesMap, mergedCategories } from './data/categories';

import parseUrl from 'parse-url';

import AuthorModel from '../server/api/client/author/model';
import CategoryModel from '../server/api/client/article/categoryModel';
import ArticleModel from '../server/api/client/article/itemModel';
import { DATABASE_URL } from '../server/constants';

import {
    MAX_DESCRIPTION_LENGTH,
    ARTICLE_PUBLISH_STATUS,
    POST_TYPES,
    IMG_TAG_REGEX,
    IMG_SRC_REGEX,
    DEFAULT_ARTICLE_PREVIEW1,
    DEFAULT_ARTICLE_WEBP_PREVIEW1,
    DEFAULT_ARTICLE_PREVIEW2,
    DEFAULT_ARTICLE_WEBP_PREVIEW2,
    DEFAULT_AUTHOR_ID,
    OTHER_CATEGORY_ID,
    OTHER_SUB_CATEGORY_ID,
    OLD_FILES_FOLDER,
    OLD_FILES_FOLDER_PATH
} from './constants';

process.env.UV_THREADPOOL_SIZE = 128;
webpConverter.grant_permission();

const IS_ARTICLE_IMAGES_INCLUDED = true;

let failedPhotosAmount = 0;
let allSymbolsNumber = 0;
let savedArticlesAmount = 0;

const downloadImage = (uri, filename, { webpNeeded }) => {
    const imageBaseDomain = 'https://newsancai.com';
    let pathname;
    try {
        let urlInfo;
        if (uri[0] === '/') {
            urlInfo = { pathname: uri };
        } else if (uri.indexOf('http') !== 0) {
            urlInfo = { pathname: `/${uri}` };
        } else {
            urlInfo = parseUrl(uri);
        }
        pathname = urlInfo.pathname;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Invalid url:', uri);
        return Promise.reject(err);
    }
    let url = `${imageBaseDomain}${pathname}`;

    if (/-\d+x\d+.[a-zA-Z0-9_.-]*$/.test(url)) {
        url = url.replace(/-\d+x\d+/, '');
    }

    return new Promise((resolve, reject) => {
        request
            .head(url)
            .timeout({
                response: 10000,
                deadline: 60000
            })
            .then(res => {
                if (!res.headers['content-type'] || res.headers['content-type'].indexOf('image/') === -1) {
                    return reject(new Error());
                }

                return request
                    .get(url)
                    .timeout({
                        response: 10000,
                        deadline: 60000
                    })

                    .on('error', () => {
                        return reject(new Error());
                    })
                    .pipe(fs.createWriteStream(filename))
                    .on('finish', error => {
                        if (error) {
                            return reject(new Error());
                        }

                        const finalFilename = `${filename.split('.').slice(0, -1).join('.')}.jpeg`;

                        sharp(filename)
                            .jpeg({
                                quality: 80
                            })
                            .toBuffer()
                            .then(buffer => {
                                return sharp(buffer)
                                    .toFile(finalFilename)
                                    .then(() => {
                                        if (filename !== finalFilename) {
                                            fs.rmSync(filename);
                                        }
                                        if (!webpNeeded) {
                                            return resolve({ webp: false, filePath: `/${finalFilename}` });
                                        }
                                        const webpFilePath = `${finalFilename.split('.').slice(0, -1).join('.')}.webp`;
                                        const webp = webpConverter.cwebp(finalFilename, webpFilePath);

                                        webp
                                            .then(() => {
                                                resolve({ webp: true, filePath: `/${finalFilename}` });
                                            })
                                            .catch(() => {
                                                resolve({ webp: false, filePath: `/${finalFilename}` });
                                            });
                                    })
                                    .catch(() => {
                                        resolve({ webp: false, filePath: `/${filename}` });
                                    });
                            })
                            .catch(() => {
                                resolve({ webp: false, filePath: `/${filename}` });
                            });
                    });
            })
            .catch(() => {
                reject(new Error());
            });
    });
};

const deleteAllAuthors = () => {
    return AuthorModel.deleteMany({});
};

const createAdminAuthors = (authorsMap, connectionFirst, connectionSecond) => {
    const authorsEntries = [...authorsMap.entries()];

    return Promise.all(
        authorsEntries.map(([mongoDbId, { id, isSecond }]) => {
            return new Promise((resolve, reject) => {
                const connection = isSecond ? connectionSecond : connectionFirst;

                connection.query(`SELECT * FROM wp_users where ID = "${id}";`, (error, results) => {
                    if (error) {
                        return reject(error);
                    }

                    const author = results[0];

                    const authorData = {
                        name: author.display_name,
                        location: '',
                        avatar: []
                    };
                    return AuthorModel.create({
                        _id: mongoDbId,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        data: {
                            'zh-cn': authorData,
                            'zh-tw': authorData,
                            en: authorData
                        }
                    })
                        .then(resolve);
                });
            });
        })
    );
};

const deleteAllCategories = () => {
    return CategoryModel.deleteMany({});
};

const getSubCategories = (connection, subCategories) => {
    const now = Date.now();
    return Promise.all(
        subCategories
            .filter(subCategory => subCategory.id !== '?')
            .map((subCategory, i) => {
                return new Promise((resolve, reject) => {
                    connection.query(`SELECT * FROM wp_terms where term_id = "${subCategory.id}";`, async (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        const subCategoryInfo = results[0];

                        if (!subCategoryInfo) {
                            return reject(new Error());
                        }

                        const subCategoryData = {
                            name: subCategoryInfo.name,
                            alias: subCategory.newAlias || subCategoryInfo.slug,
                            seoTitle: subCategoryInfo.name,
                            seoDescription: subCategoryInfo.name,
                            audioTitle: '',
                            audioFile: []
                        };
                        const preparedSubCategory = {
                            _id: getObjectId(subCategory.id),
                            createdAt: now,
                            updatedAt: now,
                            data: {
                                'zh-cn': subCategoryData,
                                'zh-tw': subCategoryData,
                                en: subCategoryData
                            },
                            positionIndex: i + 1
                        };

                        resolve(preparedSubCategory);
                    });
                });
            })
    );
};

const createCategories = connection => {
    const now = Date.now();
    return Promise.all(
        categories.map((category, i) => {
            return new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM wp_terms where term_id = "${category.id}";`, async (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    const categoryInfo = results[0];

                    if (!categoryInfo) {
                        return reject(new Error());
                    }

                    const categoryData = {
                        name: categoryInfo.name,
                        alias: categoryInfo.slug,
                        seoTitle: categoryInfo.name,
                        seoDescription: categoryInfo.name,
                        audioTitle: '',
                        audioFile: []
                    };
                    const subcategories = await getSubCategories(connection, category?.subCategories);
                    const preparedCategory = {
                        _id: getObjectId(category.id),
                        createdAt: now,
                        updatedAt: now,
                        data: {
                            'zh-cn': categoryData,
                            'zh-tw': categoryData,
                            en: categoryData
                        },
                        positionIndex: i + 1,
                        subcategories
                    };

                    CategoryModel.create(preparedCategory)
                        .then(resolve);
                });
            });
        })
    )
        .then(() => {
            const categoryData = {
                name: 'Other',
                alias: 'other',
                seoTitle: 'Other',
                seoDescription: 'Other',
                audioTitle: '',
                audioFile: []
            };
            const subCategoryData = {
                name: 'Other',
                alias: 'other',
                seoTitle: 'Other',
                seoDescription: 'Other',
                audioTitle: '',
                audioFile: []
            };
            const preparedSubCategory = {
                _id: OTHER_SUB_CATEGORY_ID,
                createdAt: now,
                updatedAt: now,
                data: {
                    'zh-cn': subCategoryData,
                    'zh-tw': subCategoryData,
                    en: subCategoryData
                },
                positionIndex: 1
            };
            const preparedCategory = {
                _id: OTHER_CATEGORY_ID,
                createdAt: now,
                updatedAt: now,
                data: {
                    'zh-cn': categoryData,
                    'zh-tw': categoryData,
                    en: categoryData
                },
                positionIndex: categories.length,
                subcategories: [preparedSubCategory]
            };

            return CategoryModel.create(preparedCategory);
        });
};

const deleteAllArticles = () => {
    return ArticleModel.deleteMany({});
};

const createFilesFolder = () => {
    if (fs.existsSync(OLD_FILES_FOLDER_PATH)) {
        fs.rmSync(OLD_FILES_FOLDER_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(OLD_FILES_FOLDER_PATH);
};

const getSeoData = (connection, articleId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM wp_postmeta where post_id = ${articleId};`, async (error, results) => {
            if (error) {
                return reject(error);
            }
            const seo = results.reduce((seo, postMeta) => {
                if (postMeta.meta_key === '_aioseop_title') {
                    seo.title = postMeta.meta_value;
                } else if (postMeta.meta_key === '_aioseop_description') {
                    seo.description = postMeta.meta_value;
                } else if (postMeta.meta_key === '_aioseop_keywords') {
                    seo.keywords = postMeta.meta_value;
                }
                return seo;
            }, {});

            resolve(seo);
        });
    });
};

const getCategoryAndSubcategoryIds = (connection, articleId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM wp_term_relationships where object_id = ${articleId};`, (error, results) => {
            if (error) {
                return reject(error);
            }
            const articleRelationshipInfo = results[0];
            if (!articleRelationshipInfo) {
                return resolve({ categoryId: null, subCategoryId: null });
            }
            let subCategoryId = String(articleRelationshipInfo.term_taxonomy_id);

            if (mergedCategories[subCategoryId]) {
                subCategoryId = mergedCategories[subCategoryId];
            }

            const categoryIdInfo = subCategoriesMap[subCategoryId];

            if (!categoryIdInfo) {
                return resolve({ categoryId: null, subCategoryId: null });
            }
            const categoryId = categoryIdInfo.categoryId;

            resolve({ categoryId, subCategoryId });
        });
    });
};

const getArticlesAndPhotos = async ({ articles, attachmentsMap }, connectionFirst, connectionSecond) => {
    const filesMap = new Map();
    const authorsMap = new Map();

    return Promise.all(articles.map(async (article, i) => {
        const connection = article.isSecond ? connectionSecond : connectionFirst;
        const description = article.post_content
            .replaceAll('&nbsp;', '')
            .replace(/\[caption id=".*" align=".*" width=".*"\]/g, '')
            .split(/\n\s*\n/)
            .map(str => `<p>${str}</p>`)
            .join('');
        const descriptionWithoutTags = striptags(description);
        const shortDescription = descriptionWithoutTags.length >= MAX_DESCRIPTION_LENGTH
            ? `${descriptionWithoutTags.slice(0, MAX_DESCRIPTION_LENGTH)}...`
            : descriptionWithoutTags;
        const imagesTags = description.match(IMG_TAG_REGEX) || [];

        const postAttachment = attachmentsMap.get(article.ID);
        const avatarImageInfo = IMG_SRC_REGEX.exec(imagesTags[0] || '');

        if (postAttachment) {
            const imagePath = postAttachment;
            const extname = path.extname(imagePath);
            const downloadedImagePath = `${OLD_FILES_FOLDER}/${i}${extname}`;

            filesMap.set(i, {
                avatar: true,
                imagePath,
                downloadedImagePath
            });
        } else if (avatarImageInfo) {
            const imagePath = avatarImageInfo[1];
            const extname = path.extname(imagePath);
            const downloadedImagePath = `${OLD_FILES_FOLDER}/${i}${extname}`;

            filesMap.set(i, {
                avatar: true,
                imagePath,
                downloadedImagePath
            });
        } else {
            filesMap.set(i, {
                avatar: true,
                failed: true
            });
        }

        description
            .split(/(<img[^>]*>)/g)
            .forEach((srcPart, j) => {
                if (srcPart.indexOf('<img') !== 0) {
                    return;
                }
                const imageInfo = IMG_SRC_REGEX.exec(srcPart || '');
                if (!imageInfo) {
                    return;
                }
                const imagePath = imageInfo[1];
                const extname = path.extname(imagePath);
                const downloadedImagePath = `${OLD_FILES_FOLDER}/${i}-${j}${extname}`;

                filesMap.set(`${i}-${j}`, {
                    imagePath,
                    downloadedImagePath
                });
            });

        const { categoryId, subCategoryId } = await getCategoryAndSubcategoryIds(connection, article.ID);
        const seo = await getSeoData(connection, article.ID);
        const seoTitle = seo.title || article.post_title || '';
        const seoDescription = seo.description || shortDescription || '';
        const seoKeywords = seo.keywords || '';

        allSymbolsNumber =
            allSymbolsNumber + article.post_title.length + description.length +
            (seoTitle === article.post_title ? 0 : seoTitle.length) +
            (seoDescription === shortDescription ? 0 : seoDescription.length) +
            seoKeywords.length;

        const authorId = getObjectId(`author-${article.post_author}`).toString();

        authorsMap.set(authorId, {
            id: article.post_author,
            isSecond: article.isSecond
        });

        return {
            article,
            articleData: {
                category: categoryId ? getObjectId(categoryId) : OTHER_CATEGORY_ID,
                alias: decodeURI(`${article.ID}-${article.post_name}`.trim()),
                title: article.post_title.replaceAll('&nbsp;', ''),
                shortDescription,
                author: authorId,
                date: +new Date(article.post_modified),
                description,
                avatar: null,
                citationText: '',
                citationAuthor: '',
                photoAuthor: DEFAULT_AUTHOR_ID,
                photoOrg: '',
                photoDescription: '',
                photoLink: '',
                tags: '',
                audioTitle: '',
                audioFile: [],
                audioTitleHeader: '',
                audioFileHeader: [],
                seoTitle,
                seoDescription,
                seoKeywords,
                subcategory: subCategoryId ? getObjectId(subCategoryId) : OTHER_SUB_CATEGORY_ID,
                status: 'published',
                isOldSiteArticle: true
            }
        };
    }))
        .then((articlesData) => {
            return { articlesData, filesMap, authorsMap };
        });
};

try {
    const startTime = Date.now();
    mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
    const connectionFirst = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'jm36new2017',
        acquireTimeout: 1000000
    });
    const connectionSecond = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'march03072023',
        acquireTimeout: 1000000
    });

    connectionFirst.query('SET GLOBAL connect_timeout=28800');
    connectionFirst.query('SET GLOBAL wait_timeout=28800');
    connectionFirst.query('SET GLOBAL interactive_timeout=28800');
    connectionSecond.query('SET GLOBAL connect_timeout=28800');
    connectionSecond.query('SET GLOBAL wait_timeout=28800');
    connectionSecond.query('SET GLOBAL interactive_timeout=28800');

    connectionFirst.connect();
    connectionSecond.connect();

    connectionFirst.on('error', function (err) {
        // eslint-disable-next-line no-console
        console.log('connectionFirst error', err);
    });
    connectionSecond.on('error', function (err) {
        // eslint-disable-next-line no-console
        console.log('connectionSecond error', err);
    });

    connectionFirst.query('SELECT * FROM wp_posts ORDER BY id DESC', async (error, results) => {
        if (error) throw error;

        await new Promise((resolve) => {
            connectionSecond.query('SELECT * FROM wp_posts ORDER BY id DESC', async (error, results2) => {
                if (error) throw error;
                const startDate = +new Date('2021-02-26 22:22:54');

                const filteredResults = results2
                    .filter(article => {
                        return +new Date(article.post_date) > startDate;
                    })
                    .map(post => {
                        post.isSecond = true;
                        return post;
                    });

                results = [...results, ...filteredResults];
                resolve();
            });
        });

        await deleteAllAuthors();
        await deleteAllCategories();
        await createCategories(connectionSecond);
        await deleteAllArticles();
        await createFilesFolder();

        const { articles, attachmentsMap } = results.reduce((result, post) => {
            if (post.post_type === POST_TYPES.ATTACHMENT && post.post_mime_type.indexOf('image') !== -1) {
                result.attachmentsMap.set(post.post_parent, post.guid);
                return result;
            }
            if (post.post_type === POST_TYPES.POST) {
                if (post.post_status !== ARTICLE_PUBLISH_STATUS) return result;

                result.articles.push(post);
                return result;
            }

            return result;
        }, { articles: [], attachmentsMap: new Map() });

        const { articlesData, filesMap, authorsMap } = await getArticlesAndPhotos({ articles, attachmentsMap }, connectionFirst, connectionSecond);

        await createAdminAuthors(authorsMap, connectionFirst, connectionSecond);

        const limitPhotos = pLimit(6);
        const filesEntries = [...filesMap.entries()];
        let filesProgressCounter = 0;
        const filesProgressBar = new cliProgress.SingleBar({
            format: 'Files Progress | {bar} | {percentage}% || {value}/{total} files',
            noTTYOutput: true
        }, cliProgress.Presets.shades_classic);
        filesProgressBar.start(filesEntries.length, 0);

        await Promise.all(
            filesEntries
                .map(([key, { imagePath, downloadedImagePath, failed, avatar: isAvatar }]) => {
                    return limitPhotos(() => {
                        if (failed) {
                            if (isAvatar) {
                                failedPhotosAmount = failedPhotosAmount + 1;
                            }
                            return Promise.resolve();
                        }

                        return downloadImage(imagePath, downloadedImagePath, { webpNeeded: isAvatar })
                            .then(({ webp, filePath }) => {
                                filesMap.set(key, { imagePath, filePath, failed: false, webp });
                                filesProgressCounter++;
                                filesProgressBar.update(filesProgressCounter);
                            })
                            .catch(() => {
                                filesMap.set(key, { imagePath, filePath: null, failed: true });
                                filesProgressCounter++;
                                filesProgressBar.update(filesProgressCounter);

                                if (isAvatar) {
                                    failedPhotosAmount = failedPhotosAmount + 1;
                                }
                            });
                    });
                })
        )
            .then(() => {
                filesProgressBar.stop();
            });

        const limitArticles = pLimit(10);
        let articlesProgressCounter = 0;
        const articlesProgressBar = new cliProgress.SingleBar({
            format: 'Articles Progress | {bar} | {percentage}% || {value}/{total} articles',
            noTTYOutput: true
        }, cliProgress.Presets.shades_classic);
        articlesProgressBar.start(articlesData.length, 0);
        await Promise.all(
            articlesData.map(({ article, articleData }, i) => {
                return limitArticles(() => {
                    const avatarInfo = filesMap.get(i);

                    if (avatarInfo && !avatarInfo.failed) {
                        articleData.avatar = [{
                            path: avatarInfo.filePath,
                            pathWebp: avatarInfo.webp ? `${avatarInfo.filePath.split('.').slice(0, -1).join('.')}.webp` : avatarInfo.filePath,
                            id: uniqId()
                        }];
                    } else {
                        const avatarImageInfo = Math.random() >= 0.5
                            ? {
                                image: DEFAULT_ARTICLE_PREVIEW1,
                                imageWebp: DEFAULT_ARTICLE_WEBP_PREVIEW1
                            }
                            : {
                                image: DEFAULT_ARTICLE_PREVIEW2,
                                imageWebp: DEFAULT_ARTICLE_WEBP_PREVIEW2
                            };

                        articleData.avatar = [{
                            path: avatarImageInfo.image,
                            pathWebp: avatarImageInfo.imageWebp,
                            id: uniqId()
                        }];
                    }

                    articleData.description = !IS_ARTICLE_IMAGES_INCLUDED
                        ? articleData.description.replace(IMG_TAG_REGEX, '')
                        : articleData.description
                            .split(/(<img[^>]*>)/g)
                            .map((srcPart, j) => {
                                if (srcPart.indexOf('<img') !== 0) {
                                    return srcPart;
                                }
                                const key = `${i}-${j}`;
                                const imageInfo = filesMap.get(key);

                                if (imageInfo && !imageInfo.failed) {
                                    return `<img src="${imageInfo.filePath}" style="width: 100%;">`;
                                } else {
                                    return '';
                                }
                            })
                            .join('');

                    articleData.description = articleData.description
                        .replace(/\[\/?embed\]/g, '')
                        // eslint-disable-next-line max-len
                        .replace(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g, '<iframe width="100%" height="360" src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>')
                        .replace(/&t=\d+s?/g, '')
                        .replace(/\?t=\d+s?/g, '')
                        .replace(/&amp;t=\d+s?/g, '');

                    const preparedArticle = {
                        createdAt: +new Date(article.post_date),
                        updatedAt: +new Date(article.post_modified),
                        comments: {
                            count: 0,
                            list: []
                        },
                        likes: {
                            count: 0,
                            list: []
                        },
                        data: {
                            'zh-cn': articleData,
                            'zh-tw': articleData,
                            en: articleData
                        }
                    };

                    return ArticleModel.create(preparedArticle)
                        .then(() => {
                            savedArticlesAmount = savedArticlesAmount + 1;
                            articlesProgressCounter++;
                            articlesProgressBar.update(articlesProgressCounter);
                        })
                        .catch(() => {
                            articlesProgressCounter++;
                            articlesProgressBar.update(articlesProgressCounter);
                        });
                });
            })
        )
            .then(() => {
                articlesProgressBar.stop();
                setTimeout(() => {
                    // eslint-disable-next-line no-console
                    console.log('Done!');
                    // eslint-disable-next-line no-console
                    console.log('Saved articles:', savedArticlesAmount);
                    // eslint-disable-next-line no-console
                    console.log('Amount of symbols:', allSymbolsNumber);
                    // eslint-disable-next-line no-console
                    console.log('Amount of default photos:', failedPhotosAmount);
                    // eslint-disable-next-line no-console
                    console.log('Execution time in seconds:', Math.ceil((Date.now() - startTime) / 1000));

                    connectionFirst.end();
                    connectionSecond.end();
                    process.exit();
                }, 0);
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log('Transform Error', err);
                connectionFirst.end();
                connectionSecond.end();
                process.exit();
            });
    });
} catch (err) {
    // eslint-disable-next-line no-console
    console.log('err', err);
    process.exit();
}
