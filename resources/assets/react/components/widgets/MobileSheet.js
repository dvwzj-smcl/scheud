import React, {Component, PropTypes} from 'react';

class MobileSheet extends Component {

    static propTypes = {
        children: PropTypes.node,
        height: PropTypes.number.isRequired
    };

    static defaultProps = {
        height: 500
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };

    render() {
        const {
            prepareStyles,
        } = this.context.muiTheme;

        const styles = {
            root: {
                marginBottom: 0,
                marginRight: 24,
                maxWidth: 360,
                width: '100%'
            },
            container: {
                border: 'solid 1px #d9d9d9'
            },
        };

        return (
            <div style={prepareStyles(styles.root)}>
                <div style={prepareStyles(styles.container)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default MobileSheet;