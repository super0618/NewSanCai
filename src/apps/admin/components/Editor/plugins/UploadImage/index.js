class UploadImage {
    constructor ({ loader, handlers, data }) {
        this.loader = loader;
        this.handlers = handlers;
        this.data = data;
    }

    // Starts the upload process.
    upload () {
        return this.loader.file
            .then(file => {
                return new Promise((resolve) => {
                    const formData = new FormData();

                    if (this.data?.filename) {
                        formData.append(file.name, file, `${this.data.filename}.${file.name.split('.').pop()}`);
                    } else {
                        formData.append(file.name, file);
                    }

                    return this.handlers.onUploadFile(formData)
                        .then(src => {
                            resolve({
                                default: src
                            });
                        });
                });
            });
    }
}

export default function UploadImagePlugin ({ handlers, data }) {
    return function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadImage({ loader, handlers, data });
        };
    };
}
