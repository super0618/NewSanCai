require('@babel/register')({
    babelrc: false,
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '8'
                }
            }
        ]
    ]
});

require('./index');
