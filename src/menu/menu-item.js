import React, {PureComponent} from 'react';
import classnames from 'classnames';
import bootstrapUtils, {bsClass} from 'react-bootstrap/lib/utils/bootstrapUtils';

class MenuItem extends PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (!this.props.href || this.props.disabled) {
      event.preventDefault();
    }

    if (this.props.disabled) {
      return;
    }

    if (this.props.onSelect) {
      this.props.onSelect(event, this.props.eventKey);
    }
  }

  render() {
    if (this.props.divider) {
      return (
        <li
          role="separator"
          className={classnames('divider', this.props.className)}
          style={this.props.style}
        />
      );
    }

    if (this.props.header) {
      const headerClass = bootstrapUtils.prefix(this.props, 'header');

      return (
        <li
          role="heading"
          className={classnames(headerClass, this.props.className)}
          style={this.props.style}
        >
          {this.props.children}
        </li>
      );
    }

    const {className, style, children} = this.props;

    const classes = {
      disabled: this.props.disabled,
      active: this.props.active
    };

    return (
      <li role="presentation"
          className={classnames(className, classes)}
          style={style}
      >
        {children}
      </li>
    );
  }
}

MenuItem.defaultProps = {
  divider: false,
  disabled: false,
  header: false
};

export default bsClass('dropdown', MenuItem);
