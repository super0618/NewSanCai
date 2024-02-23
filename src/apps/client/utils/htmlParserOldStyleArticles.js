import regexifyString from 'regexify-string';

export function oldDbArticlesParser (text) {
    let result = text
        .replace(/\\n/g, '')
        .replace(/\\r/g, '')
        .replace(/△/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\[\/caption]/g, '');

    let isIframe;
    let isUrl;

    result = regexifyString({
        pattern: /<img([\w\W]+?)[/]?>/gim,
        decorator: (matchText) => {
            return matchText && `<figure>${matchText.replace(/\\/g, '')}</figure>`;
        },
        input: result
    });

    result = result.map((text) => {
        if (text.indexOf('<p>') !== 0 && text.indexOf('<figure>') !== 0) {
            return `<p>${text}</p>`;
        } else {
            return text;
        }
    });

    result = regexifyString({
        pattern: /<iframe([\w\W]+?)[/]?>(.*?)<\/iframe>/gim,
        decorator: (matchText) => {
            if (matchText) {
                isIframe = true;
            }
            return matchText && `<div class="iframeContainer">${matchText.replace(/\\/g, '')}</div>`;
        },
        input: result.join('')
    });

    if (isIframe) {
        result = regexifyString({
            pattern: /href="<div class="iframeContainer">([\w\W]+?)[/]?>(.*?)<\/div>"/gim,
            decorator: (matchText) => {
                if (matchText) {
                    isUrl = true;
                }
                return matchText && '';
            },
            input: result.join('')
        });
    }

    if (isUrl) {
        result = regexifyString({
            pattern: /<a >(.*?)<\/a>/gim,
            decorator: (matchText) => {
                return matchText && matchText.replace(/<a >/g, '').replace(/<\/a>/g, '');
            },
            input: result.join('')
        });
    }

    return result.join('');
}

export function zhengjianArticlesParser (text) {
    let result = text;

    result = regexifyString({
        pattern: /<p([\w\W]+?)[/]?>(.*?)<\/p>/gim,
        decorator: (matchText) => {
            const img = matchText.match(/<img([\w\W]+?)[/]?>/gim);

            if (img) {
                return `<figure>${img[0].replace(/\\/g, '')}</figure>`;
            } else {
                return matchText;
            }
        },
        input: result
    });

    return result.join('');
}
