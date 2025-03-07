import classNames from 'classnames';
import PropTypes from 'prop-types';

import all from 'prop-types-extra/lib/all';
import React, { useContext } from 'react';
import { useUncontrolled } from 'uncontrollable';

import { useBootstrapPrefix } from './ThemeProvider';
import NavbarContext from './NavbarContext';
import CardContext from './CardContext';
import AbstractNav from './AbstractNav';
import NavItem from './NavItem';
import NavLink from './NavLink';
import {
  BsPrefixPropsWithChildren,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface NavProps extends BsPrefixPropsWithChildren {
  navbarBsPrefix?: string;
  cardHeaderBsPrefix?: string;
  variant?: 'tabs' | 'pills';
  activeKey?: EventKey;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  justify?: boolean;
  onSelect?: SelectCallback;
  role?: string;
  navbar?: boolean;
  navbarScroll?: boolean;
  onKeyDown?: React.KeyboardEventHandler<this>;
}

type Nav = BsPrefixRefForwardingComponent<'div', NavProps> & {
  Item: typeof NavItem;
  Link: typeof NavLink;
};

const propTypes = {
  /**
   * @default 'nav'
   */
  bsPrefix: PropTypes.string,

  /** @private */
  navbarBsPrefix: PropTypes.string,
  /** @private */
  cardHeaderBsPrefix: PropTypes.string,

  /**
   * The visual variant of the nav items.
   *
   * @type {('tabs'|'pills')}
   */
  variant: PropTypes.string,

  /**
   * Marks the NavItem with a matching `eventKey` (or `href` if present) as active.
   *
   * @type {string}
   */
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Have all `NavItem`s proportionately fill all available width.
   */
  fill: PropTypes.bool,

  /**
   * Have all `NavItem`s evenly fill all available width.
   *
   * @type {boolean}
   */
  justify: all(PropTypes.bool, ({ justify, navbar }) =>
    justify && navbar ? Error('justify navbar `Nav`s are not supported') : null,
  ),

  /**
   * A callback fired when a NavItem is selected.
   *
   * ```js
   * function (
   *  Any eventKey,
   *  SyntheticEvent event?
   * )
   * ```
   */
  onSelect: PropTypes.func,

  /**
   * ARIA role for the Nav, in the context of a TabContainer, the default will
   * be set to "tablist", but can be overridden by the Nav when set explicitly.
   *
   * When the role is "tablist", NavLink focus is managed according to
   * the ARIA authoring practices for tabs:
   * https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel
   */
  role: PropTypes.string,

  /**
   * Apply styling an alignment for use in a Navbar. This prop will be set
   * automatically when the Nav is used inside a Navbar.
   */
  navbar: PropTypes.bool,

  /**
   * Enable vertical scrolling within the toggleable contents of a collapsed Navbar.
   */
  navbarScroll: PropTypes.bool,

  as: PropTypes.elementType,

  /** @private */
  onKeyDown: PropTypes.func,
};

const defaultProps = {
  justify: false,
  fill: false,
};

const Nav: Nav = (React.forwardRef((uncontrolledProps: NavProps, ref) => {
  const {
    as = 'div',
    bsPrefix: initialBsPrefix,
    variant,
    fill,
    justify,
    navbar,
    navbarScroll,
    className,
    children,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, { activeKey: 'onSelect' });

  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav');

  let navbarBsPrefix;
  let cardHeaderBsPrefix;
  let isNavbar = false;

  const navbarContext = useContext(NavbarContext);
  const cardContext = useContext(CardContext);

  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix;
    isNavbar = navbar == null ? true : navbar;
  } else if (cardContext) {
    ({ cardHeaderBsPrefix } = cardContext);
  }

  return (
    <AbstractNav
      as={as}
      ref={ref}
      activeKey={activeKey}
      className={classNames(className, {
        [bsPrefix]: !isNavbar,
        [`${navbarBsPrefix}-nav`]: isNavbar,
        [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
        [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
        [`${bsPrefix}-${variant}`]: !!variant,
        [`${bsPrefix}-fill`]: fill,
        [`${bsPrefix}-justified`]: justify,
      })}
      {...props}
    >
      {children}
    </AbstractNav>
  );
}) as unknown) as Nav;

Nav.displayName = 'Nav';
Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

Nav.Item = NavItem;
Nav.Link = NavLink;

export default Nav;
