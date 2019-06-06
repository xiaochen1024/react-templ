import { Component } from 'react';
import differenceBy from 'lodash/differenceBy';
import intersectionBy from 'lodash/intersectionBy';

import PermissionUtil from 'scripts/utils/permission';

export const MATCH_SOME = 'match_some';
export const MATCH_ALL = 'match_all';

class AuthorizedComponent extends Component {
  hasPermissions(permissions, mode) {
    const allPermissions = PermissionUtil.getAllPermissions();
    let authorized = false;
    switch (mode) {
      case MATCH_ALL: //eslint-disable-line
        const mismatched = differenceBy(permissions, allPermissions, Number);//eslint-disable-line
        if (mismatched.length === 0) {
          authorized = true;
        }
        break;
      case MATCH_SOME: //eslint-disable-line
        const matched = intersectionBy(permissions, allPermissions, Number);//eslint-disable-line
        if (matched.length > 0) {
          authorized = true;
        }
        break;
      default:
        break;
    }

    return authorized;
  }

  render() {
    const { permissions, mode = MATCH_SOME, children } = this.props;

    if (this.hasPermissions(permissions, mode)) {
      return children;
    }
    return null;
  }
}

export default AuthorizedComponent;
