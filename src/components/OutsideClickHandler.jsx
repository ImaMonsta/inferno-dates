import Component from 'inferno-component';
import PropTypes from 'prop-types';

// import { forbidExtraProps } from 'airbnb-prop-types'; // TODO: add to propTypes; semver-major
import { addEventListener, removeEventListener } from 'consolidated-events';

const propTypes = {
  children: PropTypes.node,
  onOutsideClick: PropTypes.func,
};

const defaultProps = {
  children: <span />,
  onOutsideClick() {},
};

export default class OutsideClickHandler extends Component {
  constructor(props) {
    super(props);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  componentDidMount() {
    // `capture` flag is set to true so that a `stopPropagation` in the children
    // will not prevent all outside click handlers from firing - maja
    this.clickHandle = addEventListener(
      document,
      'click',
      this.onOutsideClick,
      { capture: true },
    );
  }

  componentWillUnmount() {
    if (this.clickHandle) removeEventListener(this.clickHandle);
  }

  onOutsideClick(e) {
    const { onOutsideClick } = this.props;
    const { childNode } = this;
    const isDescendantOfRoot = childNode && childNode.contains(e.target);
    if (!isDescendantOfRoot) {
      onOutsideClick(e);
    }
  }


  render() {
    return (
      <div ref={(ref) => { this.childNode = ref; }}>
        {this.props.children}
      </div>
    );
  }
}

OutsideClickHandler.propTypes = propTypes;
OutsideClickHandler.defaultProps = defaultProps;
