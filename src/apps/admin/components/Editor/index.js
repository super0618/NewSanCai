import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uploadFile from '../../services/uploadFile';

import UploadImagePlugin from './plugins/UploadImage';

import styles from './styles.module.css';

let CKEditor;
let ClassicEditor;

if (typeof window !== 'undefined') {
    require('@sosedisverhu/ckeditor5-build-classic/build/translations/en');
    CKEditor = require('@ckeditor/ckeditor5-react').CKEditor;
    ClassicEditor = require('@sosedisverhu/ckeditor5-build-classic');
}

// editor works wrongly with a functional component
class Editor extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        toolbar: PropTypes.array,
        filename: PropTypes.string
    };

    static defaultProps = {
        value: '',
        toolbar: undefined,
        filename: ''
    };

    render () {
        const { value, toolbar, filename } = this.props;

        return <div className={styles.editor}>
            <CKEditor
                editor={ ClassicEditor }
                config={{
                    ...(toolbar ? { toolbar } : {}),
                    allowedContent: true,
                    extraPlugins: [
                        UploadImagePlugin({
                            handlers: {
                                onUploadFile: file => uploadFile(file)
                                    .then(({ path }) => path)
                            },
                            ...(filename && { data: { filename } })
                        })
                    ],
                    image: {
                        resizeUnit: 'px',
                        toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                        styles: ['full', 'alignLeft', 'alignRight']
                    },
                    link: {
                        decorators: {
                            isExternal: {
                                mode: 'manual',
                                label: 'Open in a new tab',
                                attributes: {
                                    target: '_blank'
                                }
                            },
                            toggleDownloadable: {
                                mode: 'manual',
                                label: 'Downloadable',
                                attributes: {
                                    download: true
                                }
                            }
                        }
                    },
                    mediaEmbed: {
                        previewsInData: true
                    },
                    language: 'en'
                }}
                data={value}
                onChange={ (event, editor) => {
                    editor.conversion.for('downcast').add(function (dispatcher) {
                        dispatcher.on('insert:video', function (evt, data, conversionApi) {
                            const viewWriter = conversionApi.writer;
                            const $figure = conversionApi.mapper.toViewElement(data.item);
                            const $video = $figure.getChild(0);

                            viewWriter.setAttribute('controls', true, $video);
                        });
                    });

                    const data = editor.getData();

                    this.props.onChange({
                        target: {
                            value: data
                        }
                    });
                }}
            />
        </div>;
    }
}

export default Editor;
