//http://thorarin.net/blog/post/2017/05/05/redux-connected-react-components-in-typescript.aspx
import { connect } from 'react-redux';

interface Func<T> {
    ([...args]: any): T;
}

export default function connectedComponentHelper<TProps>() {
    return <TStateProps, TDispatchProps>(
        mapStateToProps: Func<TStateProps>,
        mapDispatchToProps?: Func<TDispatchProps>) => (
            {
                propsGeneric: null as TProps & TStateProps & TDispatchProps,
                connect: (component: any) => connect(mapStateToProps, mapDispatchToProps)(
                    component) as any as React.ComponentClass<TProps>
            });
}