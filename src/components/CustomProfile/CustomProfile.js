/*
 * Copyright 2018 dialog LLC <info@dlg.im>
 * @flow
 */

import React, { PureComponent, type Node } from 'react';
import classNames from 'classnames';
import memoize from 'lodash/memoize';
import { safelyParseJSON, safelyParseJSONSchema } from '@dlghq/dialog-utils';
import styles from './CustomProfile.css';
import CustomProfileProperty from './CustomProfileProperty';
const parseJSON = memoize(safelyParseJSON);
const parseJSONSchema = memoize(safelyParseJSONSchema);

export type Props = {
  className?: string,
  value: string,
  schema: string
};

class CustomProfile extends PureComponent<Props> {
  renderProperties(): ?Array<Node> {
    const value = parseJSON(this.props.value);
    const schema = parseJSONSchema(this.props.schema, (error) => console.error(error));

    if (!schema) {
      return null;
    }

    return Object.keys(schema.properties).map((propName) => {
      const propValue = value && value[propName] ? value[propName] : null;
      const { type, title } = schema.properties[propName];

      // Do not render property if no value presented
      if (!propValue || typeof propValue === 'undefined' || propValue === '') {
        return null;
      }

      return <CustomProfileProperty key={propName} value={propValue} type={type} title={title} />;
    });
  }

  render() {
    if (!parseJSON(this.props.value)) {
      return null;
    }

    const className = classNames(styles.container, this.props.className);

    return (
      <div className={className}>
        {this.renderProperties()}
      </div>
    );
  }
}

export default CustomProfile;
