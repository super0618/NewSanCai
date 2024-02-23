const getStaticPropsGenerator = (context, services, revalidate = 600) => {
    return Promise.all(services.map(
        service => service(context)
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

            return { props: { props, actions }, revalidate };
        });
};

export default getStaticPropsGenerator;
