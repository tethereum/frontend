module.exports = {
    siteMetadata: {
        title: 'Tethereum'
    },
    plugins: [
        {
            resolve: 'gatsby-plugin-page-creator',
            options: {
                path: `${__dirname}/src/pages`
            }
        },
        'gatsby-plugin-typescript',
        'gatsby-plugin-styled-components'
    ]
};
