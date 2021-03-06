import React from 'react';
import { Transition } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const OPEN_TIME = 500;
const CLOSE_TIME = 1000;

export default function withTransitions(Component) {
    class SemanticTransition extends React.Component {
        static propTypes = {
            toastId: PropTypes.number.isRequired,
            onClose: PropTypes.func.isRequired,
            openAnimation: PropTypes.string.isRequired,
            closeAnimation: PropTypes.string.isRequired,
            time: PropTypes.number
        };

        static defaultProps = {
            time: 2000
        };

        state = {
            visible: false,
            time: OPEN_TIME,
            animation: this.props.openAnimation
        };

        componentDidMount() {
            // schedule auto closing of toast
            if (this.props.time) {
                this.timerId = setTimeout(this.onClose, this.props.time);
            }

            // start animation as soon as toast is mounted in the dom
            this.setState({ visible: true });
        }

        onClose = () => {
            // trigger new animation when toast is dismissed
            this.setState(
                prevState => ({
                    visible: !prevState.visible,
                    animation: this.props.closeAnimation,
                    time: CLOSE_TIME
                }),
                () => {
                    setTimeout(() => {
                        if (this.timerId) {
                            clearTimeout(this.timerId);
                        }

                        this.props.onClose(this.props.toastId);
                    }, CLOSE_TIME);
                }
            );
        };

        render() {
            const { toastId, openAnimation, closeAnimation, time: timeProp, onClose, ...props } = this.props;
            const { time, visible, animation } = this.state;
            const styles = {
                marginBottom: '1em'
            };

            return (
                <Transition animation={animation} duration={time} visible={visible}>
                    <div style={styles} role="presentation">
                        <Component {...props} onClose={this.onClose} />
                    </div>
                </Transition>
            );
        }
    }

    return SemanticTransition;
}
