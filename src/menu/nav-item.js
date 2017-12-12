import React, {PureComponent} from 'react';
import classNames from 'classnames';

export default class NavItem extends PureComponent {

  static defaultProps = {
    active: false,
    disabled: false
  };

  render() {
    let {
      disabled,
      active,
      children,
      ...props
    } = this.props;
    let classes = {
      active,
      disabled
    };

    return (
      <li role="presentation" className={classNames(props.className, classes)}>
        {children}
      </li>
    );
  }

  handleClick(e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
      }
    }
  }
};
