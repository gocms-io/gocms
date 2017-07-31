import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {HOC} from 'formsy-react';

class GHidden extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
                <input type="hidden"
                       name={this.props.name}
                       value={this.props.getValue() || ''}
                />
        )
    }

}
export default HOC(GHidden);
