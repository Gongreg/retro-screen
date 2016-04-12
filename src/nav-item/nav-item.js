import React from 'react';
import classNames from 'classnames';
import createChainedFunction from 'react-bootstrap/lib/utils/createChainedFunction';

const NavItem = React.createClass({

    propTypes: {
        linkId: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        active: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        role: React.PropTypes.string,
        title: React.PropTypes.node,
        eventKey: React.PropTypes.any,
        target: React.PropTypes.string,
        'aria-controls': React.PropTypes.string
    },

    getDefaultProps() {
        return {
            active: false,
            disabled: false
        };
    },

    render() {
        let {
            disabled,
            active,
            children,
            'aria-controls': ariaControls,
            ...props } = this.props;
        let classes = {
            active,
            disabled
        };

        return (
            <li {...props} role="presentation" className={classNames(props.className, classes)}>
                { children }
            </li>
        );
    },

    handleClick(e) {
        if (this.props.onSelect) {
            e.preventDefault();

            if (!this.props.disabled) {
                this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
            }
        }
    }
});

export default NavItem;