import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';

import DangerousLineRenderGroup from './DangerousLineRenderGroup';

import '../styles/ansi.scss';

export const LOG_LINE_HEIGHT = 14;

const GROUP_OFFSET = 5000;

export default class LogLines extends Component {
  constructor() {
    super();

    this.state = {
      renderGroups: new List()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lines !== nextProps.lines) {
      let newRenderGroups = new List();

      nextProps.lines.forEach((line) => {
        if (!newRenderGroups.size) {
          // initialize on the first line
          newRenderGroups = newRenderGroups.push(
            new List().push(line)
          );
        } else {
          // is the current line > the latest group's first line offset + GROUP
          const latestRenderGroup = newRenderGroups.last();
          const thisGroupNum = line.start / GROUP_OFFSET;
          const lastLineGroupNum = latestRenderGroup.last().start / GROUP_OFFSET;
          // I dunno about these floating points.

          const shouldSplit = Math.floor(thisGroupNum) > (Math.floor(lastLineGroupNum) + 0.1);

          if (shouldSplit) {
            newRenderGroups = newRenderGroups.push(
              new List().push(line)
            );
          } else {
            newRenderGroups = newRenderGroups.set(
              -1,
              latestRenderGroup.push(line)
            );
          }
        }
      });

      this.setState({
        renderGroups: newRenderGroups
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.lines !== nextProps.lines;
  }

  render() {
    if (!this.props.isLoaded) {
      return <div>Not loaded</div>;
    }

    return (
      <div>
        <div
          style={{height: this.props.fakeLineCount * LOG_LINE_HEIGHT}}
          key="fakeLines"
        />
        {this.state.renderGroups.map((lines) => (
          <DangerousLineRenderGroup
            key={lines.first().start}
            lines={lines}
            hrefFunc={this.props.hrefFunc}
          />
        ))}
      </div>
    );
  }
}

LogLines.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  lines: PropTypes.instanceOf(List).isRequired,
  fakeLineCount: PropTypes.number,
  hrefFunc: PropTypes.func
};

LogLines.defaultProps = {
  fakeLineCount: 0
};
