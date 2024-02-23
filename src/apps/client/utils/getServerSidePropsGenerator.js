const getServerSidePropsGenerator = (context, services) => {
    return Promise.all(services.map(
        actionFunc => actionFunc(context)
    ))
        .then((answers) => {
            const { props, actions } = answers.reduce((result, answer) => {
                if (!answer) {
                    return result;
                }

                return {
                    props: {
                        ...result.props,
                        ...(answer.props || {})
                    },
                    actions: [
                        ...result.actions,
                        ...(answer.actions || [])
                    ]
                };
            }, { props: [], actions: [] });

            return { props: { props, actions } };
        });
};

export default getServerSidePropsGenerator;
